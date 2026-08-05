const { GoogleGenAI } = require('@google/genai');
const { AppError } = require('../../shared/errors/AppError');

// Initialize Gemini conditionally
let ai;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}

async function chat(message) {
  if (!ai) {
    return "Mock Response: Gemini API key is not configured. I am your DevOpsHub AI Assistant. I can help you debug Jenkins, K8s, and Docker issues!";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: "You are an expert DevOps engineer. You help users debug Docker, Kubernetes, Jenkins, and general CI/CD issues.",
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.warn("Gemini Chat Error:", error.message, "returning mock response");
    return "Mock Response: Gemini API key is not configured correctly. I am your DevOpsHub AI Assistant. I can help you debug Jenkins, K8s, and Docker issues!";
  }
}

async function analyzeLogs(logs) {
  if (!ai) {
    return {
      summary: "Mock Analysis: Appears to be a crash loop.",
      cause: "Gemini API Key not configured.",
      fix: "Set GEMINI_API_KEY in the backend .env file.",
      commands: ["export GEMINI_API_KEY=your_key", "docker-compose up -d --build"]
    };
  }

  try {
    const prompt = `Analyze the following application logs. Return ONLY a valid JSON object with these exactly 4 keys: "summary" (string, 1 sentence), "cause" (string, short description of the root cause), "fix" (string, how to fix it), "commands" (array of strings, terminal commands to run). Do not wrap the JSON in markdown blocks.\n\nLogs:\n${logs}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1, // Keep it deterministic for JSON structure
        responseMimeType: "application/json",
      }
    });
    
    let resultText = response.text.trim();
    // In case it returns markdown block ```json ... ```, strip it
    if (resultText.startsWith('```json')) resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(resultText);
  } catch (error) {
    console.warn("Gemini Analyze Logs Error:", error.message, "returning mock analysis");
    return {
      summary: "Mock Analysis: Appears to be a crash loop.",
      cause: "Gemini API Key not configured correctly.",
      fix: "Set GEMINI_API_KEY in the backend .env file.",
      commands: ["export GEMINI_API_KEY=your_key", "docker-compose up -d --build"]
    };
  }
}

async function generateDockerfile(projectType) {
  if (!ai) {
    return "# Mock Dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package.json .\nRUN npm install\nCOPY . .\nCMD [\"npm\", \"start\"]\nEXPOSE 3000";
  }

  try {
    const prompt = `Generate a production-ready, multi-stage, highly optimized Dockerfile for a project of type: "${projectType}". Return ONLY the raw Dockerfile content. Do not include markdown code block formatting like \`\`\`docker.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });
    
    let dockerfile = response.text.trim();
    if (dockerfile.startsWith('```')) {
      dockerfile = dockerfile.replace(/```(docker|Dockerfile)?\n/i, '').replace(/```$/i, '').trim();
    }
    
    return dockerfile;
  } catch (error) {
    console.warn("Gemini Dockerfile Error:", error.message, "returning mock Dockerfile");
    return "# Mock Dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package.json .\nRUN npm install\nCOPY . .\nCMD [\"npm\", \"start\"]\nEXPOSE 3000";
  }
}

module.exports = {
  chat,
  analyzeLogs,
  generateDockerfile
};
