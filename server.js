import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/consulta", async (req, res) => {
  const pregunta = req.body.pregunta || "";
  if (!pregunta.trim()) return res.status(400).json({ error: "Pregunta vacía." });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Responde como experto en normativa española de protección contra incendios. Usa referencias oficiales como RIPCI, RSCIEI, CTE (DB-SI), UNE, BOE. Sé detallado y técnico.`,
        },
        { role: "user", content: pregunta }
      ],
      temperature: 0.4,
      max_tokens: 1500
    });

    const respuesta = completion.choices[0].message.content;
    res.json({ respuesta });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al consultar GPT." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
