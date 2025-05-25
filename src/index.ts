/**
 * Raindrop.io to Telegram Daily Article Bot
 *
 * This Cloudflare Worker runs daily and sends a random article from a Raindrop.io
 * collection to a Telegram chat. If fetching fails, it sends an error notification.
 */

import { createRaindropClient } from './raindrop';
import { createTelegramClient } from './telegram';
import { formatArticleMessage } from './utils';

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		url.pathname = '/__scheduled';
		url.searchParams.append('cron', '* * * * *');
		return new Response(`Daily Article Bot is running!\n\nTo test the scheduled handler locally, run:\ncurl "${url.href}"`);
	},

	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
		console.log(`Daily Article Bot triggered at ${controller.cron}`);

		const { RAINDROP_COLLECTION_ID, RAINDROP_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_BOT_TOKEN } = env;

		// Create API clients with tokens
		const raindropClient = createRaindropClient(RAINDROP_TOKEN);
		const telegramClient = createTelegramClient(TELEGRAM_BOT_TOKEN);

		try {
			// Fetch a random article from Raindrop.io
			console.log(`Fetching random article from collection ${RAINDROP_COLLECTION_ID}`);
			const article = await raindropClient.getRandomArticle(RAINDROP_COLLECTION_ID);

			// Format the article message
			const message = formatArticleMessage(article);

			// Send the article to Telegram
			await telegramClient.sendMessage(TELEGRAM_CHAT_ID, message);

			console.log('Daily article sent successfully!');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			console.error('Daily Article Bot Error:', errorMessage);

			// Send error notification to Telegram
			await telegramClient.sendErrorMessage(TELEGRAM_CHAT_ID, errorMessage);

			console.log('Error notification sent to Telegram');
		}
	},
} satisfies ExportedHandler<Env>;
