import "server-only";
import { AiProvider } from "@/enums";

const TIMEOUT_MS = 50_000;
const MAX_OUTPUT_TOKENS = 3000;
const TEMPERATURE = 0.4;

interface AiConfig {
  provider: AiProvider;
  apiKey: string;
  model: string;
  baseUrl: string;
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

interface ChatResponse {
  choices?: { message?: { content?: string } }[];
}

export function getAiConfig(): AiConfig | undefined {
  const provider = process.env.AI_PROVIDER as AiProvider | undefined;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  const baseUrl = process.env.AI_BASE_URL ?? "";
  if (!provider || !apiKey || !model) return undefined;
  if (!Object.values(AiProvider).includes(provider)) return undefined;
  if (provider === AiProvider.OpenAiCompatible && !baseUrl) return undefined;
  return { provider, apiKey, model, baseUrl };
}

async function callGemini(config: AiConfig, system: string, user: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": config.apiKey },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: TEMPERATURE,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini trả lỗi ${res.status}`);
  const data = (await res.json()) as GeminiResponse;
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
}

async function callOpenAiCompatible(config: AiConfig, system: string, user: string): Promise<string> {
  const res = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: TEMPERATURE,
      max_tokens: MAX_OUTPUT_TOKENS,
    }),
  });
  if (!res.ok) throw new Error(`Nhà cung cấp AI trả lỗi ${res.status}`);
  const data = (await res.json()) as ChatResponse;
  return data.choices?.[0]?.message?.content ?? "";
}

function parseJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI không trả về JSON");
  return JSON.parse(text.slice(start, end + 1));
}

export async function completeJson(system: string, user: string): Promise<unknown> {
  const config = getAiConfig();
  if (!config) throw new Error("Chưa cấu hình AI (AI_PROVIDER, AI_API_KEY, AI_MODEL)");
  const text =
    config.provider === AiProvider.Gemini
      ? await callGemini(config, system, user)
      : await callOpenAiCompatible(config, system, user);
  return parseJson(text);
}
