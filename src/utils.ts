import type { PinterestItem } from './types';

/**
 * Escapes special Markdown characters for Telegram
 */
export function escapeMarkdown(text: string): string {
	return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

/**
 * Selects a random item from an array
 */
export function getRandomItem<T>(items: T[]): T {
	if (items.length === 0) {
		throw new Error('Cannot select random item from empty array');
	}
	const randomIndex = Math.floor(Math.random() * items.length);
	return items[randomIndex];
}

/**
 * Formats a Pinterest pin into a Telegram message
 */
export function formatArticleMessage(pin: PinterestItem): string {
	// const title = escapeMarkdown(pin.title);
	// const description = pin.description ? escapeMarkdown(pin.description) : 'No description available';
	// const boardName = escapeMarkdown(pin.board_name);
	// const formattedDate = formatDate(pin.created_at);

	return `🖼️ [Image](${pin.image_url})\n🔗 [View Pin](${pin.link})`;
}

/**
 * Formats an error message for Telegram notification
 */
export function formatErrorMessage(error: string): string {
	const timestamp = new Date().toISOString();
	const escapedError = escapeMarkdown(error);

	return `🚨 *Daily Pin Bot Error*

❌ Failed to fetch pin from Pinterest

*Error Details:*
${escapedError}

*Time:* ${timestamp}

Please check your Pinterest board and API token\\.`;
}

/**
 * Truncates text to a maximum length while preserving word boundaries
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}

	const truncated = text.substring(0, maxLength);
	const lastSpaceIndex = truncated.lastIndexOf(' ');

	if (lastSpaceIndex > 0) {
		return truncated.substring(0, lastSpaceIndex) + '...';
	}

	return truncated + '...';
}
