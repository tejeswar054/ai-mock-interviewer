require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

async function testGemini() {
  try {
    console.log("API Key present:", !!process.env.GEMINI_API_KEY);
    console.log("API Key length:", process.env.GEMINI_API_KEY?.length);
    
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    console.log("Created GoogleGenAI client");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello"
    });

    console.log("Response:", response.text);
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));
  }
}

testGemini();
