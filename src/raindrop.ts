import type { RaindropItem, RaindropResponse } from './types';
import { getRandomItem } from './utils';

export class RaindropClient {
	private static readonly BASE_URL = 'https://api.raindrop.io/rest/v1';

	/**
	 * Fetches a random article from a Raindrop.io collection
	 * @param collectionId - The ID of the Raindrop.io collection
	 * @param token - The Raindrop.io API token
	 * @returns A random article from the collection
	 * @throws Error if the API request fails or no articles are found
	 */
	async getRandomArticle(collectionId: string, token: string): Promise<RaindropItem> {
		const url = `${RaindropClient.BASE_URL}/raindrops/${collectionId}`;

		try {
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error('Invalid Raindrop.io API token');
				}
				if (response.status === 404) {
					throw new Error(`Collection ${collectionId} not found`);
				}
				if (response.status === 429) {
					throw new Error('Raindrop.io API rate limit exceeded');
				}
				throw new Error(`Raindrop.io API error: ${response.status} ${response.statusText}`);
			}

			const data: RaindropResponse = await response.json();

			if (!data.result) {
				throw new Error('Raindrop.io API returned unsuccessful result');
			}

			if (!data.items || data.items.length === 0) {
				throw new Error('No articles found in the collection');
			}

			// Select a random article from the collection
			const randomArticle = getRandomItem(data.items);

			console.log(`Selected random article: "${randomArticle.title}" from ${data.items.length} articles`);

			return randomArticle;
		} catch (error) {
			console.error('Raindrop.io API Error:', error);

			if (error instanceof Error) {
				throw error;
			}

			throw new Error('Unknown error occurred while fetching from Raindrop.io');
		}
	}
}
