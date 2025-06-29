export interface PinterestItem {
	readonly id: string;
	readonly title: string;
	readonly description: string;
	readonly link: string;
	readonly board_name: string;
	readonly created_at: string;
	readonly image_url: string;
}

export interface UndocumentedApiPin {
	readonly id: string;
	readonly title: string;
	readonly description: string;
	readonly link: string | null;
	readonly board: {
		readonly name: string;
	};
	readonly created_at: string;
	readonly images: {
		readonly orig: {
			readonly url: string;
		};
	};
}

export interface UndocumentedApiResponse {
	readonly resource_response: {
		readonly data: readonly UndocumentedApiPin[];
	};
}

export interface TelegramMessage {
	readonly chat_id: string;
	readonly text: string;
	readonly parse_mode: 'Markdown';
}

export interface TelegramPhotoMessage {
	readonly chat_id: string;
	readonly photo: string;
	readonly caption: string;
	readonly parse_mode: 'Markdown';
}
