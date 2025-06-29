import type { PinterestItem, UndocumentedApiResponse } from './types';
import { getRandomItem } from './utils';

interface PinterestClient {
	getRandomPin(): Promise<PinterestItem>;
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

	return {
		/**
		 * Fetches a random pin from the user's home feed.
		 * @returns A promise that resolves to a random pin item.
		 * @throws An error if the API request fails or no pins are found.
		 */
		async getRandomPin(): Promise<PinterestItem> {
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

			// const randomPin = getRandomItem([...pins]);
			const randomPin = pins[0];

			return {
				id: randomPin.id,
				title: randomPin.title || 'No Title',
				description: randomPin.description || '',
				link: randomPin.link || `https://www.pinterest.com/pin/${randomPin.id}/`,
				board_name: randomPin.board.name,
				created_at: randomPin.created_at,
				image_url: randomPin.images.orig.url,
			};
		},
	};
}
