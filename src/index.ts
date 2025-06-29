/**
 * Pinterest to Telegram Daily Pin Bot
 *
 * This Cloudflare Worker runs daily and sends a random pin from a Pinterest
 * board to a Telegram chat. If fetching fails, it sends an error notification.
 */

import { createPinterestClient } from './pinterest';
import { createTelegramClient } from './telegram';
import { formatArticleMessage } from './utils';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		url.pathname = '/__scheduled';
		url.searchParams.append('cron', '* * * * *');
		return new Response(`Daily Pin Bot is running!\n\nTo test the scheduled handler locally, run:\ncurl "${url.href}"`);
	},

	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
		console.log(`Daily Pin Bot triggered at ${controller.cron}`);

		const { PINTEREST_COOKIE, TELEGRAM_CHAT_ID, TELEGRAM_BOT_TOKEN } = env;

		// Create API clients with tokens
		const pinterestClient = createPinterestClient(PINTEREST_COOKIE);
		const telegramClient = createTelegramClient(TELEGRAM_BOT_TOKEN);

		try {
			// Fetch a random pin from Pinterest
			console.log(`Fetching random pin from homefeed`);
			const pin = await pinterestClient.getRandomPin();

			// Format the pin message
			const message = formatArticleMessage(pin);

			// Send the pin to Telegram
			await telegramClient.sendMessage(TELEGRAM_CHAT_ID, message);

			console.log('Daily pin sent successfully!');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			console.error('Daily Pin Bot Error:', errorMessage);

			// Send error notification to Telegram
			await telegramClient.sendErrorMessage(TELEGRAM_CHAT_ID, errorMessage);

			console.log('Error notification sent to Telegram');
		}
	},
} satisfies ExportedHandler<Env>;
