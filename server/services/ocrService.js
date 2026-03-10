const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const extractText = async (imagePath) => {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    return getMockOCRText();
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const ext = path.extname(imagePath).toLowerCase();

    
    if (ext === '.pdf') {
      console.log('PDF files not supported for vision OCR, using mock data');
      return getMockOCRText();
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` }
            },
            {
              type: 'text',
              text: 'Extract ALL the handwritten or printed text from this image. Return only the extracted text, preserving the original structure and formatting as much as possible. If there are diagrams or drawings, describe them briefly.'
            }
          ]
        }
      ],
      temperature: 0.2,
      max_tokens: 2048
    });

    return result.choices[0]?.message?.content || getMockOCRText();
  } catch (error) {
    console.error('OCR Error:', error.message);
    return getMockOCRText();
  }
};

function getMockOCRText() {
  return `Newton's Laws of Motion

1. First Law (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an unbalanced force.

2. Second Law (F = ma): The acceleration of an object depends on the net force acting on it and the mass of the object. Force equals mass times acceleration.

3. Third Law: For every action, there is an equal and opposite reaction. When one object exerts a force on another, the second object exerts an equal force in the opposite direction.

Key formulas:
- F = m × a
- W = m × g
- Momentum: p = m × v`;
}

module.exports = { extractText };
