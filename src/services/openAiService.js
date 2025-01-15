import OpenAI from "openai";
import config from "../config/env.js";

const client = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
});

const openAiService = async (message) => {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Comportarte como un veterinario. Deberás resolver preguntas lo más simple posible. Responde en texto plano como si fuera una conversación por WhatsApp; no saludes, no inicies conversaciones, solo responde a la pregunta del usuario."
                },
                {
                    role: "user",
                    content: message
                }
            ],
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error en openAiService:", error);
    }
};

export default openAiService;
