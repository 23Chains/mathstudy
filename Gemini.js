const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: pergunta }] }]
    })
  }
);

const data = await response.json();
const resposta = data.candidates[0].content.parts[0].text;
