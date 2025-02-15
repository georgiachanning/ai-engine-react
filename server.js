import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = 5001; // Use a separate backend port

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in .env
});

app.use(cors());
app.use(express.json()); // Parse JSON body

app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;
        console.log("Received query:", query);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant analyzing journal entries." },
                { role: "user", content: query }
            ],
        });

        const result = completion.choices[0]?.message?.content || "No response generated";
        console.log("OpenAI Response:", result);

        res.json({ result });
    } catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({ error: "Failed to process the request" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
