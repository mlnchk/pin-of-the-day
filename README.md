# Pinterest to Telegram Daily Pin Bot

A serverless TypeScript application that runs daily on Cloudflare Workers, fetching a random pin from a Pinterest board and sending it via Telegram.

## Features

- 🔄 **Daily automated execution** via Cloudflare Cron Triggers
- 📌 **Random pin selection** from your Pinterest board
- 📱 **Telegram notifications** with formatted messages
- 🚨 **Error handling** with Telegram error notifications
- ☁️ **Serverless** - runs on Cloudflare Workers free tier

## Setup

### Prerequisites

- [Cloudflare account](https://cloudflare.com) (free tier works)
- [Pinterest Developer account](https://developers.pinterest.com) with API access
- [Telegram bot](https://core.telegram.org/bots#creating-a-new-bot) created via @BotFather

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd random-pin
pnpm install
```

### 2. Configure Environment Variables

Copy the sample environment file:

```bash
cp .dev.vars.sample .dev.vars
```

Fill in your actual values in `.dev.vars`:

```bash
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
TELEGRAM_CHAT_ID="your_chat_id"
PINTEREST_COOKIE="your_pinterest_cookie"
```

### 3. Getting Required Tokens

#### Telegram Bot Token

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the instructions
3. Copy the bot token provided

#### Telegram Chat ID

1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. Copy your chat ID from the response

#### Pinterest Cookie

This project uses an undocumented Pinterest API that requires a session cookie for authentication.

1.  Log in to your Pinterest account in your web browser.
2.  Open your browser's developer tools (usually by pressing `F12` or `Cmd+Option+I`).
3.  Go to the "Network" or "Storage" tab.
4.  Find the cookies for `pinterest.com`.
5.  Copy the entire cookie string (it will be long). The value of the `_pinterest_sess` cookie is what you're looking for, but the entire `Cookie` request header value is often needed. It might start with `_pinterest_sess=...`.

**Note**: This cookie is sensitive and provides access to your account. Keep it secret. It may also expire, requiring you to update it periodically.

### 4. Deploy to Cloudflare Workers

First, log in to your Cloudflare account:

```bash
npx wrangler login

# Set up secrets (production environment)
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put PINTEREST_COOKIE

# Deploy the worker
pnpm run deploy
```

### 5. Test Locally

```bash
# Run development server with scheduled event testing
pnpm run dev

# In another terminal, trigger the scheduled event
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"
```

## Configuration

### Scheduling

The bot runs daily at 3 AM UTC by default. To change this, edit the cron expression in `wrangler.jsonc`:

```json
"triggers": {
    "crons": [
        "0 3 * * *"  // Daily at 3 AM UTC
    ]
}
```

### Message Format

Pins are sent with this format:

```
📌 *Pin Title*

_Pin description..._

📋 Board Name
🔗 View Pin
🖼️ Image

📅 Pinned on January 1, 2024
```

## Development

### Project Structure

```
src/
├── index.ts          # Main worker entry point
├── pinterest.ts      # Pinterest API client
├── telegram.ts       # Telegram Bot API client
├── types.ts          # TypeScript interfaces
└── utils.ts          # Utility functions
```

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run deploy` - Deploy to Cloudflare Workers
- `pnpm run cf-typegen` - Generate TypeScript types from Wrangler config

## Troubleshooting

### Common Issues

1. **"Invalid Telegram bot token"** - Check your bot token is correct
2. **"Pinterest API request failed" or "No pins found"** - Your `PINTEREST_COOKIE` might be invalid or expired. Follow the steps to get a new one. Also, ensure your home feed has pins.
3. **"Bot was blocked by user"** - Make sure you've started a conversation with your bot

### Logs

Check Cloudflare Workers logs:

```bash
npx wrangler tail
```

## License

MIT License - feel free to use and modify as needed.
