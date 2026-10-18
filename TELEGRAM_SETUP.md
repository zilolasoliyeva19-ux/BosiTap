# BosiTap Telegram integration setup

## Required server-side environment variables

Set these in the hosting provider's **Secrets / Environment Variables** panel. Do not put real secrets in source files or browser storage.

- `TELEGRAM_BOT_TOKEN`: the token issued by Telegram's official `@BotFather`.
- `TELEGRAM_BOT_USERNAME`: your bot username without the leading `@`, for example `BosiTapBot`.
- `TELEGRAM_WEBHOOK_SECRET`: a unique random string containing only letters, numbers, underscores, and hyphens. Do not reuse the bot token.
- `APP_URL`: the public HTTPS origin of the deployed app, with no trailing slash. Example: `https://your-app.example`.

`GEMINI_API_KEY` is unrelated to Telegram authentication.

## Set up the bot

1. Open Telegram and start a chat with `@BotFather`.
2. Send `/newbot` and follow the instructions. Save the token privately.
3. Add the four environment variables above to the host's server-side secrets panel.
4. Deploy/restart the server. On startup it registers the Telegram webhook and bot commands automatically.
5. Open the BosiTap website and open the profile modal.
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
