import { test, expect, describe } from "vitest";

import { BaseConvexClient } from "./client.js";
import {
  ClientMessage,
  QuerySetModification,
  WireServerMessage,
} from "./protocol.js";
import {
  nodeWebSocket,
  UpdateQueue,
  withInMemoryWebSocket,
} from "./client_node_test_helpers.js";
import { PaginationOptions } from "../../server/pagination.js";
import { JSONValue } from "../../values/index.js";
import { Long } from "../../vendor/long.js";
import { anyApi } from "../../server/index.js";
import { PaginatedQueryClient } from "./paginated_query_client.js";

/**
 * A faithful in-memory pagination backend for the split test below. It answers
 * each page query by slicing `data` according to the `cursor`/`endCursor` it
 * actually receives, so the test can assert on the pages the client ends up
 * with rather than on the arguments the client happened to send. Cursors are
 * opaque to callers: internally they encode an offset into `data`.
 */
class FakePaginationServer {
  // The client only requires each transition's startVersion to equal the
  // previous endVersion; the querySet/ts numbers are otherwise unconstrained.
  private querySetVersion = 0;
  private ts = 0;

  constructor(
    private io: {
      receive: () => Promise<ClientMessage>;
      send: (message: WireServerMessage) => void;
    },
    private data: JSONValue[],
    // A freshly loaded page (one requested without an endCursor) comes back with
    // a `splitCursor` and `SplitRecommended` once it reaches this many items.
    // Split halves carry an endCursor and are never re-split, so the server
    // converges. Omit to never recommend a split.
    private options: { splitThreshold?: number } = {},
  ) {}

  private toOffset(cursor: string | null | undefined): number {
    return cursor === null || cursor === undefined
      ? 0
      : parseInt(cursor.slice(1));
  }

  private toCursor(offset: number): string {
    return `c${offset}`;
  }

  private pageResult(paginationOpts: {
    cursor: string | null;
    endCursor?: string | null;
    numItems: number;
  }): JSONValue {
    const start = this.toOffset(paginationOpts.cursor);
    const hasEndCursor =
      paginationOpts.endCursor !== null &&
      paginationOpts.endCursor !== undefined;
    const end = hasEndCursor
      ? this.toOffset(paginationOpts.endCursor)
      : Math.min(start + paginationOpts.numItems, this.data.length);
    const page = this.data.slice(start, end);
    const recommendSplit =
      !hasEndCursor &&
      this.options.splitThreshold !== undefined &&
      page.length >= this.options.splitThreshold;
    return {
      page,
      isDone: end >= this.data.length,
      continueCursor: this.toCursor(end),
      splitCursor: recommendSplit
        ? this.toCursor(start + Math.floor(page.length / 2))
        : null,
      pageStatus: recommendSplit ? "SplitRecommended" : null,
    };
  }

  /**
   * Consume the connection handshake: the client's `Connect` message and the
   * (empty) query set it sends on connecting.
   */
  async awaitConnect(): Promise<void> {
    const connect = await this.io.receive();
    if (connect.type !== "Connect") {
      throw new Error(`Expected Connect, received ${connect.type}`);
    }
    const initialQuerySet = await this.io.receive();
    if (initialQuerySet.type !== "ModifyQuerySet") {
      throw new Error(
        `Expected initial ModifyQuerySet, received ${initialQuerySet.type}`,
      );
    }
  }

  /**
   * Receive query subscriptions until `count` new pages (Add modifications)
   * have been requested, then answer them all in a single transition.
   */
  async answerNextQueries({ count }: { count: number }): Promise<void> {
    const adds: { queryId: number; args: JSONValue[] }[] = [];
    while (adds.length < count) {
      const message = await this.io.receive();
      if (message.type !== "ModifyQuerySet") {
        throw new Error(`Expected ModifyQuerySet, received ${message.type}`);
      }
      for (const modification of message.modifications) {
        if (modification.type === "Add") {
          adds.push({ queryId: modification.queryId, args: modification.args });
        }
      }
    }

    const startVersion = {
      querySet: this.querySetVersion,
      identity: 0,
      ts: Long.fromNumber(this.ts),
    };
    this.querySetVersion += 1;
    this.ts += 1;
    this.io.send({
      type: "Transition",
      startVersion,
      endVersion: {
        querySet: this.querySetVersion,
        identity: 0,
        ts: Long.fromNumber(this.ts),
      },
      modifications: adds.map((add) => ({
        type: "QueryUpdated" as const,
        queryId: add.queryId,
        value: this.pageResult(
          (add.args[0] as unknown as { paginationOpts: PaginationOptions })
            .paginationOpts,
        ),
        logLines: [],
        journal: null,
      })),
    });
  }
}

describe("BaseConvexClient paginated queries with server mocked at ws level", () => {
  test("Subscribing and adding a page", async () => {
    await withInMemoryWebSocket(async ({ address, receive, send }) => {
      const q = new UpdateQueue();
      const client = new BaseConvexClient(
        address,
        () => {}, // use paginated query client for all transitions
        {
          webSocketConstructor: nodeWebSocket,
          unsavedChangesWarning: false,
        },
      );

      const paginatedClient: PaginatedQueryClient = new PaginatedQueryClient(
        client,
        ({ queries, paginatedQueries }) =>
          q.onTransition(
            client,
            paginatedClient,
          )([
            ...queries.map((t) => t.token),
            ...paginatedQueries.map((t) => t.token),
          ]),
      );

      expect((await receive()).type).toEqual("Connect");
      expect((await receive()).type).toEqual("ModifyQuerySet");

      const subscribeResult = paginatedClient.subscribe(
        "myQuery",
        { channel: "general" },
        { initialNumItems: 3, id: 1 },
      );

      expect(subscribeResult).toHaveProperty("paginatedQueryToken");

      // Query for the first page
      const queryMessage = (await receive()) as QuerySetModification;
      expect(queryMessage.type).toEqual("ModifyQuerySet");
      expect(queryMessage.modifications).toHaveLength(1);
      expect(queryMessage.modifications[0].type).toEqual("Add");
      if (queryMessage.modifications[0].type !== "Add") throw new Error();
      expect(queryMessage.modifications[0].udfPath).toEqual("myQuery:default");

      // Should include pagination options in args
      const args = queryMessage.modifications[0].args[0] as unknown as {
        channel: string;
        paginationOpts: PaginationOptions;
      };
      expect(args).toHaveProperty("channel", "general");
      expect(args).toHaveProperty("paginationOpts");
      expect(args.paginationOpts).toHaveProperty("cursor", null);

      const result1 = paginatedClient.localQueryResult(
        "myQuery",
        { channel: "general" },
        { initialNumItems: 3, id: 1 },
      );
      expect(result1?.results).toEqual([]);
      expect(result1?.status).toEqual("LoadingFirstPage");

      send({
        type: "Transition",
        startVersion: {
          querySet: 0,
          identity: 0,
          ts: Long.fromNumber(0),
        },
        endVersion: {
          querySet: 1,
          identity: 0,
          ts: Long.fromNumber(100),
        },
        modifications: [
          {
            type: "QueryUpdated",
            queryId: queryMessage.modifications[0].queryId,
            value: {
              page: ["a", "b", "c"],
              isDone: false,
              continueCursor: "start after c",
              splitCursor: null,
              pageStatus: null,
            },
            logLines: [],
            journal: null,
          },
        ],
      });

      // That send should be enough to kick off a transition if we just wait for it.
      let i = 0;
      await q.awaitPromiseAtIndexWithTimeout(i++);

      const result2 = paginatedClient.localQueryResult(
        "myQuery",
        { channel: "general" },
        { initialNumItems: 3, id: 1 },
      );
      expect(result2?.results).toEqual(["a", "b", "c"]);
      expect(result2?.status).toEqual("CanLoadMore");

      result2!.loadMore(5);

      // just calling loadMore causes an update: now we're in LoadingMore state.
      const update2 = await q.awaitPromiseAtIndexWithTimeout(i++);
      expect(Object.keys(update2)).toHaveLength(1);
      expect(Object.values(update2)[0].status === "LoadingMore");

      // Query for the second page
      const queryMessage2 = (await receive()) as QuerySetModification;
      expect(queryMessage2.type).toEqual("ModifyQuerySet");
      expect(queryMessage2.modifications).toHaveLength(1);
      expect(queryMessage2.modifications[0].type).toEqual("Add");
      if (queryMessage2.modifications[0].type !== "Add") throw new Error();
      expect(queryMessage2.modifications[0].udfPath).toEqual("myQuery:default");
      expect(queryMessage2.modifications[0].args[0] as any).toEqual({
        channel: "general",
        paginationOpts: {
          cursor: "start after c",
          numItems: 5,
          id: 1,
        },
      });

      const localQueryResult = paginatedClient.localQueryResult(
        "myQuery",
        { channel: "general" },
        { initialNumItems: 3, id: 1 },
      );
      expect(localQueryResult?.status).toEqual("LoadingMore");
      expect(localQueryResult?.results).toEqual(["a", "b", "c"]);

      send({
        type: "Transition",
        startVersion: {
          querySet: 1,
          identity: 0,
          ts: Long.fromNumber(100),
        },
        endVersion: {
          querySet: 2,
          identity: 0,
          ts: Long.fromNumber(200),
        },
        modifications: [
          {
            type: "QueryUpdated",
            queryId: queryMessage2.modifications[0].queryId,
            value: {
              page: ["d", "e", "f"],
              isDone: false,
              continueCursor: "start after f",
              splitCursor: null,
              pageStatus: null,
            },
            logLines: [],
            journal: null,
          },
        ],
      });

      const update3 = await q.awaitPromiseAtIndexWithTimeout(i++);
      // Both the page query and the paginated query are updated
      expect(Object.keys(update3)).toHaveLength(2);

      // Let's add some elements
      send({
        type: "Transition",
        startVersion: {
          querySet: 2,
          identity: 0,
          ts: Long.fromNumber(200),
        },
        endVersion: {
          querySet: 2,
          identity: 0,
          ts: Long.fromNumber(300),
        },
        modifications: [
          {
            type: "QueryUpdated",
            queryId: queryMessage.modifications[0].queryId,
            value: {
              page: ["a", "b", "ba", "bb", "c"],
              isDone: false,
              continueCursor: "start after c",
              splitCursor: "after ba",
              pageStatus: "SplitRecommended",
            },
            logLines: [],
            journal: null,
          },
        ],
      });
      const update4 = await q.awaitPromiseAtIndexWithTimeout(i++);
      // Both the page query and the paginated query are updated
      expect(Object.keys(update4)).toHaveLength(2);

      const actual = paginatedClient.localQueryResult(
        "myQuery",
        { channel: "general" },
        { initialNumItems: 3, id: 1 },
      );
      expect(actual?.results).toEqual([
        "a",
        "b",
        "ba",
        "bb",
        "c",
        "d",
        "e",
        "f",
      ]);
      expect(actual?.status).toEqual("CanLoadMore");

      await client.close();
    });
  });

  test("Splitting a non-first page yields the correct concatenated pages", async () => {
    await withInMemoryWebSocket(async ({ address, receive, send }) => {
      const DATA = ["a", "b", "c", "d", "e", "f", "g", "h"];
      // Recommend splitting any full 5-item page, so the oversized second page
      // (loaded with numItems 5) splits while the 3-item first page does not.
      const server = new FakePaginationServer({ receive, send }, DATA, {
        splitThreshold: 5,
      });

      const q = new UpdateQueue();
      const client = new BaseConvexClient(
        address,
        () => {}, // use paginated query client for all transitions
        {
          webSocketConstructor: nodeWebSocket,
          unsavedChangesWarning: false,
        },
      );

      const paginatedClient: PaginatedQueryClient = new PaginatedQueryClient(
        client,
        ({ queries, paginatedQueries }) =>
          q.onTransition(
            client,
            paginatedClient,
          )([
            ...queries.map((t) => t.token),
            ...paginatedQueries.map((t) => t.token),
          ]),
      );

      const getResult = () =>
        paginatedClient.localQueryResult(
          "myQuery",
          { channel: "general" },
          { initialNumItems: 3, id: 1 },
        );

      await server.awaitConnect();

      paginatedClient.subscribe(
        "myQuery",
        { channel: "general" },
        { initialNumItems: 3, id: 1 },
      );

      let i = 0;

      // Load the first page: DATA[0..3) = [a, b, c].
      await server.answerNextQueries({ count: 1 });
      await q.awaitPromiseAtIndexWithTimeout(i++);
      expect(getResult()?.results).toEqual(["a", "b", "c"]);
      expect(getResult()?.status).toEqual("CanLoadMore");

      // Load a second page, which starts at the first page's continueCursor and
      // comes back oversized so the server recommends a split.
      getResult()!.loadMore(5);
      await q.awaitPromiseAtIndexWithTimeout(i++);
      await server.answerNextQueries({ count: 1 });
      await q.awaitPromiseAtIndexWithTimeout(i++);

      // The split subscribes two new page queries. Answer both together so the
      // split completes in a single transition.
      await server.answerNextQueries({ count: 2 });
      await q.awaitPromiseAtIndexWithTimeout(i++);

      // The visible pages must be the dataset exactly once, in order — no rows
      // duplicated from re-reading the start of the dataset in a split half.
      expect(getResult()?.results).toEqual(DATA);
      expect(getResult()?.status).toEqual("Exhausted");

      await client.close();
    });
  });
});

describe("BaseConvexClient paginated queries without connecting", () => {
  test("Page splitting with optimistic updates", async () => {
    // Use a non-existent address so the client can't connect
    // This allows optimistic updates to persist
    const address = "https://127.0.0.1:3001";
    const q = new UpdateQueue();

    const client = new BaseConvexClient(
      address,
      () => {}, // use the paginated client for all transitions
      {
        webSocketConstructor: nodeWebSocket,
        unsavedChangesWarning: false,
      },
    );
    const paginatedClient: PaginatedQueryClient = new PaginatedQueryClient(
      client,
      ({ queries, paginatedQueries }) =>
        q.onTransition(
          client,
          paginatedClient,
        )([
          ...queries.map((t) => t.token),
          ...paginatedQueries.map((t) => t.token),
        ]),
    );

    const mockPage = (
      opts: PaginationOptions,
      retval: {
        page: any[];
        continueCursor: string | null;
        isDone: boolean;
        splitCursor?: string | null;
        pageStatus?: "SplitRecommended" | null;
      },
    ) => {
      // Use an optimistic mutation to set query results
      void client.mutation(
        "myMutation",
        {},
        {
          optimisticUpdate: (localStore) => {
            localStore.setQuery(
              anyApi.myQuery.default,
              {
                channel: "general",
                paginationOpts: { ...opts, id: 1 },
              },
              retval,
            );
          },
        },
      );
    };

    // Subscribe to a paginated query
    const subscribeResult = paginatedClient.subscribe(
      "myQuery",
      { channel: "general" },
      { initialNumItems: 3, id: 1 },
    );

    expect(subscribeResult).toHaveProperty("paginatedQueryToken");

    // Initially should be loading
    let result = paginatedClient.localQueryResult(
      "myQuery",
      { channel: "general" },
      { initialNumItems: 3, id: 1 },
    );
    expect(result?.status).toEqual("LoadingFirstPage");

    // Mock first page - this should trigger a page split due to splitCursor
    mockPage(
      {
        numItems: 3,
        cursor: null,
      },
      {
        page: ["item1", "item2", "item3", "item4", "item5"],
        continueCursor: "after5",
        isDone: false,
        splitCursor: "after3",
        pageStatus: "SplitRecommended",
      },
    );

    // Wait for the transition to process
    await q.awaitPromiseAtIndexWithTimeout(0);

    // The splitting logic should have been triggered
    result = paginatedClient.localQueryResult(
      "myQuery",
      { channel: "general" },
      { initialNumItems: 3, id: 1 },
    );
    expect(result?.results).toEqual([
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
    ]);
    expect(result?.status).toEqual("CanLoadMore");

    // Mock the split pages - first half
    mockPage(
      {
        numItems: 3,
        cursor: null,
        endCursor: "after3",
      },
      {
        page: ["item1S", "item2S", "item3S"],
        continueCursor: "after3",
        isDone: false,
      },
    );

    // Mock the split pages - second half
    mockPage(
      {
        numItems: 3,
        cursor: "after3",
        endCursor: "after5",
      },
      {
        page: ["item4S", "item5S"],
        continueCursor: "after5",
        isDone: false,
      },
    );

    await q.awaitPromiseAtIndexWithTimeout(1);
    await q.awaitPromiseAtIndexWithTimeout(2);

    result = paginatedClient.localQueryResult(
      "myQuery",
      { channel: "general" },
      { initialNumItems: 3, id: 1 },
    );
    expect(result?.results).toEqual([
      "item1S",
      "item2S",
      "item3S",
      "item4S",
      "item5S",
    ]);
    expect(result?.status).toEqual("CanLoadMore");

    await client.close();
  });
});
