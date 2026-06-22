export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY não configurada' });
  }

  try {
    const { messages, max_tokens } = req.body;

    // Pega a última mensagem do utilizador
    const userMessage = messages?.[messages.length - 1]?.content || '';

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
          generationConfig: {
            maxOutputTokens: max_tokens || 1000,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({ error: data.error?.message || 'Erro Gemini' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Responde no mesmo formato que a Anthropic API
    // para que o index.html não precise de alterações
    return res.status(200).json({
      content: [{ type: 'text', text }],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
