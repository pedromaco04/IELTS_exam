exports.handler = async function(event, context) {
  // Solo aceptamos peticiones seguras tipo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Recibimos el texto del estudiante
    const { promptText } = JSON.parse(event.body);
    
    // Sacamos tu llave de la bóveda
    const apiKey = process.env.GEMINI_API_KEY;

    // Si por alguna razón Netlify no lee la llave, frenamos aquí
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No se encontró la API Key en Netlify.' })
      };
    }

    // Conectamos con Google Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();

    // Devolvemos la respuesta
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error en el servidor al procesar la IA.' })
    };
  }
};