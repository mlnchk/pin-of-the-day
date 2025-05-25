# Raindrop.io to Telegram Daily Article Bot

A serverless TypeScript application that runs daily on Cloudflare Workers, fetching a random article from a Raindrop.io collection and sending it via Telegram.

## Features

- 🔄 **Daily automated execution** via Cloudflare Cron Triggers
- 📚 **Random article selection** from your Raindrop.io collection
- 📱 **Telegram notifications** with formatted messages
- 🚨 **Error handling** with Telegram error notifications
- ☁️ **Serverless** - runs on Cloudflare Workers free tier

## Setup

### Prerequisites

- [Cloudflare account](https://cloudflare.com) (free tier works)
- [Raindrop.io account](https://raindrop.io) with API access
- [Telegram bot](https://core.telegram.org/bots#creating-a-new-bot) created via @BotFather

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd random-article
npm install
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
RAINDROP_TOKEN="your_raindrop_api_token"
```

### 3. Getting Required Tokens

**Note:** This project is configured to use a specific Raindrop.io collection (ID: 51232036). If you want to use your own collection, update the `RAINDROP_COLLECTION_ID` in `wrangler.jsonc`.

#### Telegram Bot Token

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the instructions
3. Copy the bot token provided

#### Telegram Chat ID

1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. Copy your chat ID from the response

#### Raindrop.io API Token

1. Go to [Raindrop.io App Settings](https://app.raindrop.io/settings/integrations)
2. Create a new app or use existing
3. Create and copy the "Test token"

#### Raindrop.io Collection ID

1. Go to your collection in Raindrop.io
2. The collection ID is in the URL: `https://app.raindrop.io/my/{collection_id}`

### 4. Deploy to Cloudflare Workers

```bash
# Login to Cloudflare (first time only)
npx wrangler login

# Set up secrets (production environment)
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put RAINDROP_TOKEN

# Deploy the worker
npm run deploy
```

### 5. Test Locally

```bash
# Run development server with scheduled event testing
npm run dev

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

Articles are sent with this format:

```
📚 *Article Title*

_Article excerpt..._

🌐 domain.com
🔗 Read More

📅 Shared on January 1, 2024
```

## Development

### Project Structure

```
src/
├── index.ts          # Main worker entry point
├── raindrop.ts       # Raindrop.io API client
├── telegram.ts       # Telegram Bot API client
├── types.ts          # TypeScript interfaces
└── utils.ts          # Utility functions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run cf-typegen` - Generate TypeScript types from Wrangler config

### Environment Variables

| Variable                 | Type     | Description                        |
| ------------------------ | -------- | ---------------------------------- |
| `TELEGRAM_BOT_TOKEN`     | Secret   | Telegram bot token from @BotFather |
| `RAINDROP_TOKEN`         | Secret   | Raindrop.io API token              |
| `TELEGRAM_CHAT_ID`       | Variable | Your Telegram chat ID              |
| `RAINDROP_COLLECTION_ID` | Variable | Target Raindrop.io collection ID   |

## Troubleshooting

### Common Issues

1. **"Invalid Telegram bot token"** - Check your bot token is correct
2. **"Collection not found"** - Verify your collection ID and API token
3. **"Bot was blocked by user"** - Make sure you've started a conversation with your bot

### Logs

Check Cloudflare Workers logs:

```bash
npx wrangler tail
```

## License

MIT License - feel free to use and modify as needed.
