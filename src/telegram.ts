import type { TelegramMessage, TelegramPhotoMessage } from './types';
import { formatErrorMessage } from './utils';

interface TelegramClient {
	sendMessage(chatId: string, message: string): Promise<void>;
	sendPhoto(chatId: string, photoUrl: string, caption: string): Promise<void>;
	sendErrorMessage(chatId: string, error: string): Promise<void>;
}

/**
 * Creates a Telegram Bot API client with the provided token
 * @param token - The Telegram bot token
 * @returns A client instance for interacting with Telegram Bot API
 */
export function createTelegramClient(token: string): TelegramClient {
	const BASE_URL = 'https://api.telegram.org';
	const MAX_MESSAGE_LENGTH = 4096;
	const MAX_CAPTION_LENGTH = 1024;

	return {
		/**
		 * Sends a message to a Telegram chat
		 * @param chatId - The Telegram chat ID
		 * @param message - The message text (supports Markdown)
		 * @throws Error if the message fails to send
		 */
		async sendMessage(chatId: string, message: string): Promise<void> {
			const url = `${BASE_URL}/bot${token}/sendMessage`;

			// Truncate message if it's too long
			const truncatedMessage = message.length > MAX_MESSAGE_LENGTH ? message.substring(0, MAX_MESSAGE_LENGTH - 3) + '...' : message;

			const payload: TelegramMessage = {
				chat_id: chatId,
				text: truncatedMessage,
				parse_mode: 'Markdown',
			};

			try {
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				});

				if (!response.ok) {
					const errorData = (await response.json().catch(() => ({}))) as { description?: string };

					if (response.status === 401) {
						throw new Error('Invalid Telegram bot token');
					}
					if (response.status === 400) {
						throw new Error(`Bad request to Telegram API: ${errorData.description || 'Unknown error'}`);
					}
					if (response.status === 403) {
						throw new Error('Bot was blocked by the user or chat not found');
					}

					throw new Error(`Telegram API error: ${response.status} ${response.statusText}`);
				}

				const result = (await response.json()) as { ok: boolean; description?: string };

				if (!result.ok) {
					throw new Error(`Telegram API returned error: ${result.description || 'Unknown error'}`);
				}

				console.log(`Message sent successfully to chat ${chatId}`);
			} catch (error) {
				console.error('Telegram API Error:', error);

				if (error instanceof Error) {
					throw error;
				}

				throw new Error('Unknown error occurred while sending Telegram message');
			}
		},

		/**
		 * Sends a photo with a caption to a Telegram chat
		 * @param chatId - The Telegram chat ID
		 * @param photoUrl - The URL of the photo to send
		 * @param caption - The caption for the photo (supports Markdown)
		 * @throws Error if the message fails to send
		 */
		async sendPhoto(chatId: string, photoUrl: string, caption: string): Promise<void> {
			const url = `${BASE_URL}/bot${token}/sendPhoto`;

			// Truncate caption if it's too long
			const truncatedCaption = caption.length > MAX_CAPTION_LENGTH ? caption.substring(0, MAX_CAPTION_LENGTH - 3) + '...' : caption;

			const payload: TelegramPhotoMessage = {
				chat_id: chatId,
				photo: photoUrl,
				caption: truncatedCaption,
				parse_mode: 'Markdown',
			};

			try {
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				});

				if (!response.ok) {
					const errorData = (await response.json().catch(() => ({}))) as { description?: string };

					if (response.status === 401) {
						throw new Error('Invalid Telegram bot token');
					}
					if (response.status === 400) {
						throw new Error(`Bad request to Telegram API: ${errorData.description || 'Unknown error'}`);
					}
					if (response.status === 403) {
						throw new Error('Bot was blocked by the user or chat not found');
					}

					throw new Error(`Telegram API error: ${response.status} ${response.statusText}`);
				}

				const result = (await response.json()) as { ok: boolean; description?: string };

				if (!result.ok) {
					throw new Error(`Telegram API returned error: ${result.description || 'Unknown error'}`);
				}

				console.log(`Photo sent successfully to chat ${chatId}`);
			} catch (error) {
				console.error('Telegram API Error (sendPhoto):', error);

				if (error instanceof Error) {
					throw error;
				}

				throw new Error('Unknown error occurred while sending Telegram photo');
			}
		},

		/**
		 * Sends an error notification message to a Telegram chat
		 * @param chatId - The Telegram chat ID
		 * @param error - The error message or description
		 */
		async sendErrorMessage(chatId: string, error: string): Promise<void> {
			try {
				const errorMessage = formatErrorMessage(error);
				await this.sendMessage(chatId, errorMessage);
				console.log('Error notification sent to Telegram');
			} catch (telegramError) {
				// If we can't send the error message to Telegram, at least log it
				console.error('Failed to send error notification to Telegram:', telegramError);
				console.error('Original error that we tried to report:', error);

				// Don't throw here - we don't want to create an infinite loop of errors
			}
		},
	};
}
