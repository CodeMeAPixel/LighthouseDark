import { createOpenAI, type OpenAIProvider } from "@ai-sdk/openai";

let _openai: OpenAIProvider | null = null;

export function getOpenAI(): OpenAIProvider {
	if (!_openai) {
		_openai = createOpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
	}
	return _openai;
}
