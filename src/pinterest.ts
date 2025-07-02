import type { PinterestItem, UndocumentedApiResponse } from './types';
import { getRandomItem } from './utils';

interface PinterestClient {
	getRandomPin(): Promise<PinterestItem>;
	getRandomPins(count: number): Promise<PinterestItem[]>;
}

/**
 * Creates a Pinterest API client using an undocumented endpoint.
 * @param cookie - The Pinterest authentication cookie string.
 * @returns A client instance for interacting with the Pinterest API.
 *
 * @see https://github.com/bstoilov/py3-pinterest/tree/master/py3pin
 */
export function createPinterestClient(cookie: string): PinterestClient {
	// const API_URL = 'https://www.pinterest.com/_ngjs/resource/UserHomefeedResource/get/';
	const API_URL = 'https://ru.pinterest.com/_ngjs/resource/UserHomefeedResource/get/'; // Subdomain depends on where cookie is from

	/**
	 * Fetches pins from the Pinterest API
	 * @returns Raw pins data from the API
	 */
	async function fetchPinsData(): Promise<PinterestItem[]> {
		const response = await fetch(API_URL, {
			method: 'GET',
			headers: {
				Cookie: cookie,
				'x-pinterest-pws-handler': 'www/index.js',
			},
		});

		if (!response.ok) {
			const errorBody = await response.text();
			throw new Error(`Pinterest API request failed: ${response.status} ${response.statusText}\n${errorBody}`);
		}

		const apiResponse = (await response.json()) as UndocumentedApiResponse;
		const pins = apiResponse.resource_response.data;

		if (!pins || pins.length === 0) {
			throw new Error(`No pins found. The user may have no pins or the API request failed.`);
		}

		return pins
			.filter((pin) => pin.images)
			.map((pin) => ({
				id: pin.id,
				title: pin.title || 'No Title',
				description: pin.description || '',
				link: pin.link || `https://www.pinterest.com/pin/${pin.id}/`,
				board_name: pin.board?.name || 'No Board',
				created_at: pin.created_at,
				image_url: pin.images!.orig.url,
			}));
	}

	return {
		/**
		 * Fetches a random pin from the user's home feed.
		 * @returns A promise that resolves to a random pin item.
		 * @throws An error if the API request fails or no pins are found.
		 */
		async getRandomPin(): Promise<PinterestItem> {
			const pins = await fetchPinsData();
			return getRandomItem([...pins]);
		},

		/**
		 * Fetches multiple random pins from the user's home feed.
		 * @param count - The number of random pins to fetch (max available pins if count exceeds available)
		 * @returns A promise that resolves to an array of random pin items.
		 * @throws An error if the API request fails or no pins are found.
		 */
		async getRandomPins(count: number): Promise<PinterestItem[]> {
			const pins = await fetchPinsData();

			if (count >= pins.length) {
				// If requesting more pins than available, return all pins shuffled
				return [...pins].sort(() => Math.random() - 0.5);
			}

			// Select random pins without duplicates
			const shuffled = [...pins].sort(() => Math.random() - 0.5);
			return shuffled.slice(0, count);
		},
	};
}
