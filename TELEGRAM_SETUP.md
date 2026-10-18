# BosiTap Telegram integration setup

## Required server-side environment variables

Set these in the hosting provider's **Secrets / Environment Variables** panel. Do not put real secrets in source files or browser storage.

- `TELEGRAM_BOT_TOKEN`: the token issued by Telegram's official `@BotFather`.
- `TELEGRAM_BOT_USERNAME`: your bot username without the leading `@`, for example `BosiTapBot`.
- `TELEGRAM_WEBHOOK_SECRET`: a unique random string containing only letters, numbers, underscores, and hyphens. Do not reuse the bot token.
- `APP_URL`: the public HTTPS origin of the **Vercel frontend**, with no trailing slash. It is used for the Mini App button and CORS allowlist.
- `API_URL`: the public HTTPS origin of the **Railway backend**, with no trailing slash. The Telegram webhook is registered at `${API_URL}/api/telegram/webhook`.
- `VITE_API_BASE_URL`: set this in Vercel to the same Railway backend origin as `API_URL` (no trailing slash), then redeploy the frontend. This variable is public and contains no secret.

`GEMINI_API_KEY` is unrelated to Telegram authentication.

## Set up the bot

1. Open Telegram and start a chat with `@BotFather`.
2. Send `/newbot` and follow the instructions. Save the token privately.
3. Deploy the backend from the BosiTap GitHub repository to Railway, using `npm run build` as the build command and `npm start` as the start command.
4. Generate a public HTTPS domain for the Railway service. Add `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_SECRET`, `APP_URL`, and `API_URL` to the Railway service variables. Set `API_URL` to the Railway domain and `APP_URL` to the Vercel frontend URL.
5. In Vercel, add `VITE_API_BASE_URL` with the Railway domain as its value, then redeploy the frontend.
6. Redeploy/restart the Railway backend after variables are set. On startup it registers the Telegram webhook and bot commands automatically.
7. Open the BosiTap website and open the profile modal.
6. Choose **Telegram orqali kirish**, then click **Telegram botni ochish**.
7. Press **Start** in the bot chat. Return to BosiTap; the profile should link after Telegram confirms the code.
8. Try `/start`, `/play`, and `/help` in the bot chat.

## Security notes

- The bot token is only used on the server; never share it or commit it to GitHub.
- If a token was exposed, revoke/regenerate it with `@BotFather` and update the server secret.
- The webhook checks Telegram's `X-Telegram-Bot-Api-Secret-Token` header.
- Login codes expire after five minutes and are consumed after successful verification. Creation is rate-limited.
- Login sessions currently live in the server's memory. This works for a single running server instance, but a server restart clears active sessions. For multi-instance production hosting, move sessions to a shared database or Redis store.
- Telegram login will not work until the public HTTPS URL, token, username, and webhook secret are configured correctly.
