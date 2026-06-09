import aiClient from '../config/aiClient.js';

// ─── Deterministic Output Schema ──────────────────────────────────────────────
// This is the exact JSON structure the AI must return for every file.
// Enforced via response_format: json_object — LLM behaves as a structured
// database delivery engine, not a free-form text generator.

const SYSTEM_PROMPT = `
You are an expert static code analysis engine and technical documentation generator.

Your ONLY job is to analyze source code files and extract structured API documentation.

You MUST respond with a single, valid JSON object that strictly follows this schema:

{
  "language": "string — detected programming language (e.g. JavaScript, Python, Go)",
  "summary": "string — 2-3 sentence plain-English summary of what this file does",
  "endpoints": [
    {
      "method": "string — HTTP method: GET | POST | PUT | DELETE | PATCH",
      "path": "string — the route path e.g. /api/users/:id",
      "description": "string — what this endpoint does",
      "params": [
        { "name": "string", "type": "string", "required": true, "description": "string" }
      ],
      "requestBody": {
        "description": "string",
        "fields": [
          { "name": "string", "type": "string", "required": true, "description": "string" }
        ]
      },
      "responseSchema": {
        "description": "string",
        "fields": [
          { "name": "string", "type": "string", "description": "string" }
        ]
      }
    }
  ],
  "functions": [
    {
      "name": "string — function name",
      "description": "string — what it does",
      "params": [
        { "name": "string", "type": "string", "required": true, "description": "string" }
      ],
      "returns": "string — return type and description",
      "isAsync": true
    }
  ],
  "classes": [
    {
      "name": "string — class name",
      "description": "string — what this class represents",
      "methods": [
        {
          "name": "string",
          "description": "string",
          "params": [],
          "returns": "string",
          "access": "public | private | protected"
        }
      ],
      "properties": [
        { "name": "string", "type": "string", "description": "string" }
      ]
    }
  ],
  "imports": [
    { "module": "string", "purpose": "string" }
  ],
  "constants": [
    { "name": "string", "value": "string", "description": "string" }
  ]
}

CRITICAL RULES:
- Return ONLY the JSON object. No markdown, no explanation, no code fences.
- If a section has no items (e.g. no classes), return an empty array [].
- Strip all internal implementation comments, database URIs, and secrets.
- Only document the PUBLIC API surface — what consumers of this file need to know.
- Do not invent or hallucinate endpoints or functions that do not exist in the code.
`;

// ─── Core Parser Function ─────────────────────────────────────────────────────

/**
 * Sends a single file's raw source code to Gemini 2.5 Flash.
 * Returns a strictly typed, parsed JSON documentation object.
 *
 * @param {Object} file - File object from the upload pipeline
 * @param {string} file.filename - Original filename
 * @param {string} file.content  - Raw UTF-8 source code string
 * @param {string} file.extension - File extension e.g. ".js"
 * @param {number} file.sizeKB   - File size in KB
 * @returns {Promise<Object>} Structured documentation object
 */
export const parseFileWithAI = async (file) => {
  const userMessage = `
Analyze the following source code file and return the structured JSON documentation.

Filename: ${file.filename}
Language hint: ${file.extension}

--- SOURCE CODE START ---
${file.content}
--- SOURCE CODE END ---
`;

  const response = await aiClient.chat.completions.create({
    model: 'gemini-2.5-flash',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    // NOTE: response_format is intentionally omitted — Gemini's OpenAI-compatible
    // endpoint does not reliably honour { type: 'json_object' } and may throw.
    // The system prompt already enforces JSON-only output.
    temperature: 0.1,
  });

  let rawJson = response.choices[0].message.content;

  // Strip any accidental markdown code fences the model may add
  // e.g. ```json ... ``` or ``` ... ```
  rawJson = rawJson
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  // Parse and validate — if model returns malformed JSON, catch it cleanly
  let parsed;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error(`AI returned malformed JSON for file: ${file.filename}`);
  }

  return {
    filename: file.filename,
    extension: file.extension,
    sizeKB: file.sizeKB,
    documentation: parsed,
    parsedAt: new Date().toISOString(),
    model: 'gemini-2.5-flash',
  };
};

/**
 * Processes multiple files sequentially (rate-limit safe).
 * Returns an array of structured documentation objects.
 *
 * @param {Array} files - Array of file objects from upload pipeline
 * @returns {Promise<Array>} Array of parsed documentation objects
 */
export const parseMultipleFiles = async (files) => {
  const results = [];

  for (const file of files) {
    try {
      const result = await parseFileWithAI(file);
      results.push({ success: true, ...result });
    } catch (error) {
      // Don't fail the entire batch — report per-file errors gracefully
      results.push({
        success: false,
        filename: file.filename,
        error: error.message,
        parsedAt: new Date().toISOString(),
      });
    }
  }

  return results;
};
