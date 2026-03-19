const express = require("express");
const router = express.Router();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/", async (req, res) => {
  const { message, history } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an AI sales caller.
Ask short questions and qualify the lead.
At the end say: FINAL RESULT: HOT LEAD or COLD LEAD
`
        },
        ...history,
        { role: "user", content: message }
      ]
    });

    console.log("FULL RESPONSE:", completion); 

    const reply =
      completion?.choices?.[0]?.message?.content || "Sorry, I didn't get that.";

    res.json({ reply });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;