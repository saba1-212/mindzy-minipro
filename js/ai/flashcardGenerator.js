async function generateFlashcards() {

  const text =
    document.getElementById("extractedText").value;

  const output =
    document.getElementById("aiOutput");

  if (!text.trim()) {

    output.innerHTML =
      "❌ Please analyze content first.";

    return;
  }

  output.innerHTML =
    "⏳ Generating Flashcards...";

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "Authorization":
            `Bearer ${GROQ_API_KEY}`

        },

        body: JSON.stringify({

          model: "llama-3.1-8b-instant",

          messages: [
            {
              role: "user",

              content: `
You are an exam preparation assistant.

Analyze ONLY the study material provided below.

Generate 15 UNIQUE flashcards.

Rules:
- Use ONLY information present in the study material.
- Do NOT invent topics.
- Do NOT mention DBMS unless it exists in the material.
- Cover different concepts.
- Avoid repeated questions.
- Include definitions, facts, examples, formulas, and important points.
- Return ONLY valid JSON.

Format:

[
  {
    "question":"Question from the material",
    "answer":"Answer from the material"
  }
]

Study Material:

${text.substring(0,8000)}
`
            }
          ],

          temperature: 0.3

        })

      }
    );

    const data =
      await response.json();

    console.log(data);

    const aiResponse =
      data.choices[0].message.content;

    const cleanedResponse =
      aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let jsonStart =
  cleanedResponse.indexOf("[");

let jsonEnd =
  cleanedResponse.lastIndexOf("]") + 1;

const jsonText =
  cleanedResponse.substring(
    jsonStart,
    jsonEnd
  );

const cards =
  JSON.parse(jsonText);

    let html = `

      <h2>🧠 Flashcards</h2>

      <div class="flashcard-container">

    `;

    cards.forEach(card => {

      html += `

        <div class="flashcard">

          <h3>
            ❓ ${card.question}
          </h3>

          <p>
            💡 ${card.answer}
          </p>

        </div>

      `;

    });

    html += `</div>`;

    output.innerHTML = html;

  }

  catch (err) {

    console.error(err);

    output.innerHTML =
      "❌ Flashcard generation failed.";

  }

}

window.generateFlashcards =
  generateFlashcards;