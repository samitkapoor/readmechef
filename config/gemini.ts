export const getGeminiReponse = async (prompt: string) => {
  let data = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  });

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' +
      process.env.GEMINI_API_KEY,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    }
  );

  const res = await response.json();
  return res;
};
