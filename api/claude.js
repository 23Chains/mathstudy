module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY nao configurada' });
  }

  try {
    const { messages, max_tokens } = req.body;
    const userMessage = messages?.[messages.length - 1]?.content || '';

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: max_tokens || 1000,
        temperature: 0.7
      })
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      return res.status(groqRes.status).json({ error: data.error?.message || 'Erro Groq' });
    }

    const text = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({
      content: [{ type: 'text', text }],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
