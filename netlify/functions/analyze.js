export const handler = async (event) => {
  // Solo aceptamos peticiones seguras tipo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Recibimos el texto del estudiante desde tu página
    const { promptText } = JSON.parse(event.body);
    
    // Sacamos tu llave maestra de la bóveda secreta de Netlify
    const apiKey = process.env.GEMINI_API_KEY;

    // Conectamos con el cerebro de Google Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();

    // Devolvemos la evaluación de Gemini a tu página web
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al conectar con la IA.' })
    };
  }
};
