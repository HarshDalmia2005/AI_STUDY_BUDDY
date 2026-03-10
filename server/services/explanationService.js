const Groq = require('groq-sdk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const generateExplanation = async (text, language = 'English') => {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    return getMockExplanation(language);
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const result = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are an expert tutor. Always respond with valid JSON only, no markdown or extra text.'
        },
        {
          role: 'user',
          content: `Given the following notes/text, provide a comprehensive learning guide in ${language}. 
    
Return your response in this exact JSON format (and nothing else):
{
  "explanation": "A simple, clear explanation of all concepts in the text",
  "steps": ["Step 1: ...", "Step 2: ..."],
  "keyConcepts": ["concept1", "concept2", "concept3"],
  "summary": "A brief 2-3 sentence summary",
  "examples": ["Example 1: ...", "Example 2: ..."]
}

Text to explain:
${text}`
        }
      ],
      temperature: 0.5,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    const responseText = result.choices[0]?.message?.content || '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getMockExplanation(language);
  } catch (error) {
    console.error('Explanation Error:', error.message);
    return getMockExplanation(language);
  }
};

function getMockExplanation(language) {
  return {
    explanation: language === 'Hindi' 
      ? "न्यूटन के गति के नियम भौतिकी की आधारशिला हैं। पहला नियम बताता है कि वस्तुएं अपनी वर्तमान अवस्था में बनी रहती हैं जब तक कोई बल उन पर कार्य न करे। दूसरा नियम बल, द्रव्यमान और त्वरण के संबंध को बताता है। तीसरा नियम क्रिया-प्रतिक्रिया का सिद्धांत बताता है।"
      : "Newton's Laws of Motion are the foundation of classical mechanics. The First Law tells us that objects resist changes to their state of motion — this property is called inertia. The Second Law gives us a mathematical relationship between force, mass, and acceleration (F=ma). The Third Law states that forces always come in pairs — every action has an equal and opposite reaction.",
    steps: [
      "Step 1: Understand that all motion is governed by forces",
      "Step 2: Learn the First Law — objects stay in their current state unless a force acts on them",
      "Step 3: Master the Second Law equation F = ma (Force = mass × acceleration)",
      "Step 4: Apply the Third Law — every force has an equal and opposite reaction force",
      "Step 5: Practice with real-world examples to solidify understanding"
    ],
    keyConcepts: ["Inertia", "Force", "Mass", "Acceleration", "Action-Reaction", "Momentum"],
    summary: "Newton's three laws describe how objects move. The first law is about inertia, the second relates force to acceleration, and the third states every action has an equal reaction.",
    examples: [
      "Example: A book stays on a table (First Law) until you push it. The harder you push (more force), the faster it accelerates (Second Law). When you push the book, the book pushes back on your hand (Third Law).",
      "Example: A rocket works because exhaust gases push backward (action), and the rocket moves forward (reaction) — demonstrating Newton's Third Law."
    ]
  };
}

module.exports = { generateExplanation };
