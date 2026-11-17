import http from "http";
import { URL } from "url";

const CLIENT_ID ="211031494115-2rlfmpej21p35342kpu5a64t9s32oqkl.apps.googleusercontent.com";
const CLIENT_SECRET="nXvZ2CjdTsaFzZUi9JxGUnZuXKkQ";
const REDIRECT_URI = "http://localhost:8080/oauth2callback";
const SCOPE = "https://www.googleapis.com/auth/gmail.send";

const AUTH_URL="https:...uth?" +
  "client_id=" + CLIENT_ID + "&" +
  "redirect_uri=" + encodeURIComponent(REDIRECT_URI) + "&" +
  "response_type=code&" +
  "scope=" + encodeURIComponent(SCOPE) + "&" +
  "access_type=offline&" +
  "prompt=consent";

const server = http.createServer(async (req, res) => {
  if (req.url.includes("oauth2callback")) {
    const url = new URL(req.url, "http://localhost:8080");
    const code = url.searchParams.get("code");

    if (!code) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("Aucun code reçu. Refaites l'authentification.");
    }

    const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await tokenResp.json();

    if (data.error) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("Erreur OAuth : " + data.error + " - " + data.error_description);
    }

    console.log("\n[OK] refresh_token reçu :");
    console.log("GMAIL_REFRESH_TOKEN=***" + data.refresh_token);

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      "<html><body>" +
      "<h1>refresh_token reçu</h1>" +
      "<p>" + data.refresh_token + "</p>" +
      "<p>Colle dans Convex :</p>" +
      "<pre>npx convex env set GMAIL_REFRESH_TOKEN=*** </pre>" +
      "</body></html>"
    );
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(
    "<h2>OAuth 2.0 - Refresh Token</h2>" +
    "<a href='" + AUTH_URL + "'>Lancer l'authentification</a>"
  );
});

server.listen(8080, () => {
  console.log("Ouvre http://localhost:8080 dans ton navigateur");
});