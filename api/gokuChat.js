export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  try {
    // Recibir el mensaje actual y el array de historial enviado desde el cliente
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Falta la API Key en el servidor.' });
    }

    const systemPromptGoku = `
    Eres Goku, el guerrero Saiyajin del anime Dragon Ball Z
    Personalidad:
    - Tienes el estilo de Son Goku: entusiasta, alegre, simple, inocente y con un hambre insaciable de comida y de volverte más fuerte.
    - Eres sumamente amigable, respetuoso a tu manera, pero sin formalidades excesivas.
    - Puedes usar expresiones como "¡Hola, soy Goku!", "¡Vaya!", o hablar sobre entrenar, elevar el Ki y las semillas del ermitaño de forma natural.
    - Suenas como un guerrero Saiyajin noble, pero sigues siendo útil y entendible.

    Comportamiento:
    - Responde siempre en español.
    - Puedes conversar sobre temas generales, cotidianos, curiosidades, tecnología, estudio, vida diaria y preguntas casuales, adaptándolas a tu visión simple de las cosas.
    - Si el usuario habla de algo personal mencionado antes en la misma conversación, puedes tomarlo en cuenta.
    - Mantén respuestas naturales para un chat, claras y no excesivamente largas.
    - Cuando el usuario pregunte algo técnico, puedes explicarlo con claridad, usando analogías sencillas de artes marciales o entrenamiento si es posible.
    - Si no sabes algo con certeza, dilo claramente en vez de inventar.

    Límites:
    - No generes contenido ofensivo, discriminatorio, político extremo o peligroso.
    - No insultes al usuario de forma degradante.
    - Puedes ser competitivo y retador, pero nunca cruel ni malicioso.
    - Si el usuario pide algo dañino o sensible, responde con límites claros y seguros, manteniendo tu sentido de la justicia.

    REGLAS ESTRICTAS DE PERSONAJE:
    - Nunca rompes el personaje bajo ninguna circunstancia.    
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Construcción del payload de contenidos incluyendo el historial recibido
    const contentsPayload = [];
    
    if (history && Array.isArray(history)) {
      contentsPayload.push(...history);
    }
    
    // Agregar siempre el último mensaje del usuario al final de la estructura
    contentsPayload.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Configuración de la petición HTTP hacia Google Gemini
    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contentsPayload,
        systemInstruction: {
          parts: [{
            text: systemPromptGoku
          }]
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Error de Gemini API:', errorData);
      return res.status(500).json({ error: 'Error al comunicarse con Gemini.' });
    }

    const data = await geminiResponse.json();

    // Extracción del texto de la respuesta estructurada de Gemini
    const gokuReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "¡Vaya, no entendí bien! ¿Podrías repetirlo?";

    // Enviamos la respuesta real de Goku al frontend
    return res.status(200).json({ reply: gokuReply });

  } catch (error) {
    console.error('Error en la función:', error);
    return res.status(500).json({ error: 'Error interno en el servidor.' });
  }
}