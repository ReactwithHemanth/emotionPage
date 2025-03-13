// import { HumanMessage } from "langchain/schema"; // LangChain message schema
const apiKey = "AIzaSyD4LvXDh6ogmvRykMctSXRwrMGGrXxmKkE";

// export const geminiModel = new ChatGoogleGenerativeAI({
//   apiKey: apiKey, // Replace with your actual API key
//   modelName: "gemini-pro", // Use the appropriate model
// });
export const analyzeEmotionWithGemini = async (happiness, energy, anger, anxiety, motivation) => {
  // Replace with your actual API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  // Initialize LangChain model

  const prompt = `Provide a practical and emotional tip and 3 actionable steps based on these emotional scores like a personal doctor:
    - Happiness: ${happiness}
    - Energy: ${energy}
    - Anger: ${anger}
    - Anxiety: ${anxiety}
    - Motivation: ${motivation}

    Format the response in HTML as follows:
    <ul>
      <li><strong>Tip:</strong> [Your tip here]</li>
      <li><strong>Steps:</strong>
        <ol>
          <li>[Step 1]</li>
          <li>[Step 2]</li>
          <li>[Step 3]</li>
        </ol>
      </li>
    </ul>`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 250, // Limit response length
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data from Gemini API");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};
