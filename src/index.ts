/**
 * Pinterest to Telegram Daily Pin Bot
 *
 * This Cloudflare Worker runs daily and sends a random pin from a Pinterest
 * board to a Telegram chat. If fetching fails, it sends an error notification.
 */

import { createPinterestClient } from './pinterest';
import { createTelegramClient } from './telegram';
import { formatArticleMessage, formatMultiplePinsMessage } from './utils';

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
			// Fetch 3 random pins from Pinterest
			console.log(`Fetching 3 random pins from homefeed`);
			const pins = await pinterestClient.getRandomPins(3);

			// Send pins as a media group with individual captions
			const mediaGroupPhotos = pins.map((pin) => ({
				url: pin.image_url,
				caption: formatMultiplePinsMessage(pins),
			}));

			await telegramClient.sendMediaGroup(TELEGRAM_CHAT_ID, mediaGroupPhotos);

			console.log('Daily pins sent successfully!');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			console.error('Daily Pin Bot Error:', errorMessage);

			// Send error notification to Telegram
			await telegramClient.sendErrorMessage(TELEGRAM_CHAT_ID, errorMessage);

			console.log('Error notification sent to Telegram');
		}
	},
} satisfies ExportedHandler<Env>;
