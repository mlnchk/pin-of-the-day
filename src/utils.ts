import type { RaindropItem } from './types';

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
 * Formats a Raindrop article into a Telegram message
 */
export function formatArticleMessage(article: RaindropItem): string {
	const title = escapeMarkdown(article.title);
	const excerpt = article.excerpt ? escapeMarkdown(article.excerpt) : 'No excerpt available';
	const domain = escapeMarkdown(article.domain);
	const formattedDate = formatDate(article.created);

	return `📚 *${title}*

_${excerpt}_

🌐 ${domain}
🔗 [Read More](${article.link})

📅 Shared on ${formattedDate}`;
}

/**
 * Formats an error message for Telegram notification
 */
export function formatErrorMessage(error: string): string {
	const timestamp = new Date().toISOString();
	const escapedError = escapeMarkdown(error);

	return `🚨 *Daily Article Bot Error*

❌ Failed to fetch article from Raindrop\\.io

*Error Details:*
${escapedError}

*Time:* ${timestamp}

Please check your Raindrop\\.io collection and API token\\.`;
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
