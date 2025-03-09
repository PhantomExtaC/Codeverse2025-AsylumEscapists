import { GoogleGenerativeAI } from '@google/generative-ai';

const API_URL = process.env.LM_STUDIO_API_URL || "http://localhost:1234/v1/chat/completions";
const MODEL_NAME = process.env.AI_MODEL_NAME || "LLaMA v2";
const MODEL_PARAMS = process.env.AI_MODEL_PARAMETERS || "7B";

// LLaMA v2 model configuration
const MODEL_CONFIG = {
  "name": "LLaMA v2",
  "arch": "llama",
  "quant": "Q3_K_S",
  "context_length": 4096,
  "embedding_length": 4096,
  "num_layers": 32,
  "rope": {
    "dimension_count": 128
  },
  "head_count": 32,
  "head_count_kv": 32,
  "parameters": "7B"
};

export async function askAI(question: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { 
            role: "system", 
            content: "You are an AI assistant that provides concise, factual responses in the third person perspective. Focus only on relevant information without personal opinions or first-person language."
          },
          { 
            role: "user", 
            content: question 
          }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false
      })
    });

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Failed to get AI response");
  }
}

export async function analyzeCode(code: string, language: string): Promise<string> {
  try {
    // First request for code execution
    const executionResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { 
            role: "system", 
            content: `You are a ${language} code execution engine. Follow these rules strictly:
              1. First verify if the code matches ${language} syntax
              2. If syntax is incorrect, return "SYNTAX ERROR:" followed by a brief explanation
              3. If syntax is correct, simulate the code execution
              4. If execution would fail, return "RUNTIME ERROR:" followed by the error message
              5. If execution would succeed, return "OUTPUT:" followed by the expected output
              6. Keep responses concise and focused on execution results`
          },
          { 
            role: "user", 
            content: code
          }
        ],
        temperature: 0.3,
        max_tokens: -1,
        stream: false
      })
    });

    const executionResult = await executionResponse.json();
    const executionOutput = executionResult.choices[0].message.content;

    // Second request for code analysis
    const analysisResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { 
            role: "system", 
            content: `You are a ${language} code analyzer. Analyze the following code and provide:
              1. Brief explanation of what the code does
              2. Any potential improvements or best practices
              3. Keep the analysis concise and practical
              Format as: "ANALYSIS:" followed by your points`
          },
          { 
            role: "user", 
            content: code
          }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false
      })
    });

    const analysisResult = await analysisResponse.json();
    const analysisOutput = analysisResult.choices[0].message.content;

    // Combine both results
    return `${executionOutput}\n\n${analysisOutput}`;
  } catch (error) {
    console.error("Code Analysis Error:", error);
    throw new Error("Failed to analyze code");
  }
}

export async function summarizeText(text: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { 
            role: "system", 
            content: "Summarize the following text concisely while maintaining key points."
          },
          { 
            role: "user", 
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false
      })
    });

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Summarization Error:", error);
    throw new Error("Failed to summarize text");
  }
} 