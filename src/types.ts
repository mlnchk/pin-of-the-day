export interface RaindropItem {
	readonly _id: number;
	readonly title: string;
	readonly excerpt: string;
	readonly link: string;
	readonly domain: string;
	readonly created: string;
}

export interface RaindropResponse {
	readonly result: boolean;
	readonly items: RaindropItem[];
	readonly count: number;
}

export interface TelegramMessage {
	readonly chat_id: string;
	readonly text: string;
	readonly parse_mode: 'Markdown';
}
