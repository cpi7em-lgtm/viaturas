// api/auth/google/start.ts
function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: "GOOGLE_CLIENT_ID nao configurado" });
  }
  const { redirect_uri, state } = req.query;
  if (!redirect_uri) {
    return res.status(400).json({ error: "redirect_uri obrigatorio" });
  }
  const combinedState = `${state || ""}|${redirect_uri}`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    state: combinedState,
    prompt: "select_account"
  });
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  res.statusCode = 302;
  res.setHeader("Location", googleAuthUrl);
  return res.end();
}
export {
  handler as default
};
