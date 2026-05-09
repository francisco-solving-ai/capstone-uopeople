const API_KEY = "API_KEY";
const MODEL = "gemini-1.5-flash";
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

/**
 * Sends a prompt to Gemini and returns the generated text.
 *
 * @param {string} prompt - User prompt for the model.
 * @returns {Promise<string>} Generated text response.
 */
async function askGemini(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API request failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

if (typeof window !== "undefined") {
  window.askGemini = askGemini;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { askGemini };
}

// Example:
// askGemini("Say hello in one sentence.")
//   .then(console.log)
//   .catch(console.error);
