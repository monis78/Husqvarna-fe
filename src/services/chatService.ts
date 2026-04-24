import { API_BASE_URL } from "../constants/config";

interface StreamQueryParams {
  query: string;
  systemPrompt?: string;
  onTextUpdate: (text: string) => void;
}

const getStreamErrorMessage = (errorText: string): string => {
  try {
    const errorBody = JSON.parse(errorText) as {
      detail?: unknown;
      message?: unknown;
    };

    console.log(errorBody)

    if (typeof errorBody.detail === "string") {
      return errorBody.detail;
    }

    if (typeof errorBody.message === "string") {
      return errorBody.message;
    }
  } catch {
    return errorText;
  }

  return errorText;
};

export const streamQueryResponse = async ({
  query,
  systemPrompt,
  onTextUpdate,
}: StreamQueryParams): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/llm/query/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      ...(systemPrompt ? { system_prompt: systemPrompt } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text()
    console.log("Stream error response:", errorText);
    throw new Error(
      errorText
        ? getStreamErrorMessage(errorText)
        : "Failed to stream response",
    );
  }

  if (!response.body) {
    throw new Error("Streaming is not supported by this browser");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let streamedText = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    streamedText += decoder.decode(value, { stream: true });
    onTextUpdate(streamedText);
  }

  const remainingText = decoder.decode();
  if (remainingText) {
    streamedText += remainingText;
    onTextUpdate(streamedText);
  }

  return streamedText;
};
