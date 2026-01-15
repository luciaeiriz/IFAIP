import OpenAI from 'openai'

const openaiApiKey = process.env.OPENAI_API_KEY

if (!openaiApiKey) {
  console.warn('⚠️ OPENAI_API_KEY not set - description generation will be skipped')
}

const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null

/**
 * Generate a landing page description using OpenAI
 * Returns a description similar in style and length to existing ones (125-145 characters)
 */
export async function generateLandingPageDescription(
  name: string,
  tag: string
): Promise<string | null> {
  if (!openai) {
    console.warn('⚠️ OpenAI not configured, skipping description generation')
    return null
  }

  try {
    const prompt = `Generate a concise, professional description for an AI certification landing page. 

The landing page is for: ${name} (tag: ${tag})

Requirements:
- Length: 125-145 characters (similar to these examples)
- Style: Professional, clear, benefit-focused
- Format: Single sentence, no line breaks
- IMPORTANT: Do NOT include quotation marks in your response

Examples of existing descriptions:
- AI certification programs designed for business owners and entrepreneurs looking to leverage artificial intelligence to grow their business. (145 chars)
- Specialized AI training for restaurant owners to optimize operations, improve customer experience, and increase profitability. (130 chars)
- AI certification courses tailored for fleet managers to enhance logistics, reduce costs, and improve operational efficiency. (125 chars)

Generate a similar description for ${name} professionals. Focus on how AI certification can help them in their specific industry/role. Return ONLY the description text without any quotation marks or formatting.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional copywriter specializing in educational content for AI certification programs. Generate concise, compelling descriptions that match the style and length of the provided examples. NEVER include quotation marks in your response - return only the plain text description.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    })

    const generatedDescription = completion.choices[0]?.message?.content?.trim()

    if (!generatedDescription) {
      console.warn('⚠️ OpenAI returned empty description')
      return null
    }

    // Ensure the description is within the target length range
    let finalDescription = generatedDescription
    
    // Remove any quotes if OpenAI wrapped it (handle both single and double quotes at start/end)
    finalDescription = finalDescription.trim()
    if (finalDescription.startsWith('"') && finalDescription.endsWith('"')) {
      finalDescription = finalDescription.slice(1, -1).trim()
    }
    if (finalDescription.startsWith("'") && finalDescription.endsWith("'")) {
      finalDescription = finalDescription.slice(1, -1).trim()
    }
    
    // Remove any remaining quotation marks from anywhere in the string
    finalDescription = finalDescription.replace(/^["']+|["']+$/g, '').trim()

    // Truncate if too long, but try to keep it natural
    if (finalDescription.length > 150) {
      // Try to truncate at a sentence boundary
      const sentences = finalDescription.match(/[^.!?]+[.!?]+/g)
      if (sentences && sentences.length > 0) {
        let truncated = ''
        for (const sentence of sentences) {
          if ((truncated + sentence).length <= 150) {
            truncated += sentence
          } else {
            break
          }
        }
        if (truncated.length > 100) {
          finalDescription = truncated.trim()
        } else {
          // Fallback: just truncate at 145 chars
          finalDescription = finalDescription.substring(0, 145).trim()
        }
      } else {
        finalDescription = finalDescription.substring(0, 145).trim()
      }
    }

    console.log(`✅ Generated description for "${name}": ${finalDescription} (${finalDescription.length} chars)`)
    return finalDescription
  } catch (error) {
    console.error('❌ Error generating landing page description:', error)
    return null
  }
}
