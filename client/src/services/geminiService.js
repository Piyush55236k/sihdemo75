// Gemini API integration service for chatbot
// Docs: https://ai.google.dev/docs/api/rest


// Call Gemini via backend API
export async function fetchGeminiChatResponse(messages) {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error('Gemini API error: ' + (errorData.error || response.status));
  }
  const data = await response.json();
  return data.response || '';
}
