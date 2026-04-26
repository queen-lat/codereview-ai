import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import Groq from 'groq-sdk'

const app = express()
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/review', async (req, res) => {
  const { code } = req.body

  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'No code provided' })
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an expert code reviewer. Review the following code and respond with ONLY a JSON array — no explanation, no markdown, just raw JSON.

Each item in the array must have:
- "type": one of "error", "warning", or "good"
- "line": a short string like "Line 3" or "Line 5–8"
- "text": a clear, helpful explanation of the issue or praise

Example format:
[
  { "type": "error", "line": "Line 2", "text": "No error handling here." },
  { "type": "good", "line": "Line 1", "text": "Good use of async/await." }
]

Here is the code to review:

${code}`
        }
      ]
    })

    const raw = completion.choices[0].message.content
    const parsed = JSON.parse(raw)
    res.json({ review: parsed })

  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ error: 'Something went wrong. Check your API key and try again.' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})