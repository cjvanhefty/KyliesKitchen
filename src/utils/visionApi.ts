/**
 * Recipe extraction from an image using a vision API (e.g. OpenAI GPT-4 Vision).
 * Set VITE_OPENAI_API_KEY in .env (not committed).
 */

export interface ExtractedRecipe {
  title: string;
  source: string;
  ingredients: string;
  instructions: string;
  notes: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64 ?? '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function extractRecipeFromImage(file: File): Promise<ExtractedRecipe> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey?.trim()) {
    throw new Error('Missing VITE_OPENAI_API_KEY. Add it to .env and restart the dev server.');
  }

  const base64 = await fileToBase64(file);
  const mime = file.type || 'image/jpeg';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are helping extract a recipe from a photo of a handwritten or printed recipe. 
Respond with a JSON object only (no markdown, no code block), with these exact keys: title, source, ingredients, instructions, notes.
- title: recipe name
- source: e.g. "Mom", "Great Grandma Mullenberg", or cookbook name, or empty string if unknown
- ingredients: full ingredients list as plain text (preserve line breaks)
- instructions: full instructions as plain text (preserve line breaks)
- notes: any tips, substitutions, or notes; empty string if none`,
            },
            {
              type: 'image_url',
              image_url: { url: `data:${mime};base64,${base64}` },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Vision API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('No response from vision API');

  // Strip possible markdown code fence
  let jsonStr = content;
  const codeMatch = content.match(/^```(?:json)?\s*([\s\S]*?)```$/);
  if (codeMatch) jsonStr = codeMatch[1].trim();

  const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
  return {
    title: String(parsed.title ?? ''),
    source: String(parsed.source ?? ''),
    ingredients: String(parsed.ingredients ?? ''),
    instructions: String(parsed.instructions ?? ''),
    notes: String(parsed.notes ?? ''),
  };
}
