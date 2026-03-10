const Groq = require('groq-sdk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const generateQuiz = async (text, numQuestions = 5) => {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    return getMockQuiz().questions;
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const result = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are a quiz generator. Always respond with valid JSON only, no markdown or extra text.'
        },
        {
          role: 'user',
          content: `Based on the following study material, generate exactly ${numQuestions} quiz questions. Mix MCQ and short answer types.

Return your response in this exact JSON format (and nothing else):
{
  "questions": [
    {
      "type": "mcq",
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "This is correct because..."
    },
    {
      "type": "short",
      "question": "Explain...",
      "options": [],
      "correctAnswer": "The correct answer is...",
      "explanation": "This is explained by..."
    }
  ]
}

Study material:
${text}`
        }
      ],
      temperature: 0.6,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    const responseText = result.choices[0]?.message?.content || '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.questions || getMockQuiz().questions;
    }
    return getMockQuiz().questions;
  } catch (error) {
    console.error('Quiz Generation Error:', error.message);
    return getMockQuiz().questions;
  }
};

function getMockQuiz() {
  return {
    questions: [
      {
        type: 'mcq',
        question: "What does Newton's First Law describe?",
        options: ['Inertia', 'Gravity', 'Friction', 'Magnetism'],
        correctAnswer: 'Inertia',
        explanation: "Newton's First Law is also known as the Law of Inertia. It states that an object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force."
      },
      {
        type: 'mcq',
        question: 'Which formula represents Newton\'s Second Law?',
        options: ['E = mc²', 'F = ma', 'V = IR', 'P = mv'],
        correctAnswer: 'F = ma',
        explanation: 'Newton\'s Second Law states that Force equals mass times acceleration (F = ma).'
      },
      {
        type: 'mcq',
        question: "According to Newton's Third Law, what happens when you push a wall?",
        options: [
          'The wall pushes back with equal force',
          'The wall absorbs the force',
          'Nothing happens',
          'The force disappears'
        ],
        correctAnswer: 'The wall pushes back with equal force',
        explanation: "Newton's Third Law states that for every action, there is an equal and opposite reaction."
      },
      {
        type: 'short',
        question: 'Define momentum and write its formula.',
        options: [],
        correctAnswer: 'Momentum is the product of mass and velocity. Formula: p = m × v',
        explanation: 'Momentum (p) is a measure of how hard it is to stop a moving object. It depends on both mass (m) and velocity (v).'
      },
      {
        type: 'mcq',
        question: 'If you double the force on an object while keeping mass constant, what happens to acceleration?',
        options: ['It doubles', 'It halves', 'It stays the same', 'It quadruples'],
        correctAnswer: 'It doubles',
        explanation: 'From F = ma, if F doubles and m stays constant, then a must also double to maintain the equation.'
      }
    ]
  };
}

module.exports = { generateQuiz };
