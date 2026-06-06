async function generateQuiz() {

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
    "⏳ Generating Quiz...";

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization":
            `Bearer ${GROQ_API_KEY}`
        },

        body: JSON.stringify({

          model: "llama-3.1-8b-instant",

          messages: [
            {
              role: "user",
              content: `
Generate 10 MCQs from this study material.

Format:
Question
A)
B)
C)
D)
Answer:

${text.substring(0, 4000)}
`
            }
          ]
        })
      }
    );

    const data =
      await response.json();

    output.innerHTML = `

      <div class="ai-result">

        <h2>❓ Quiz Generator</h2>

        <pre>
${data.choices[0].message.content}
        </pre>

      </div>

    `;

  } catch (err) {

    console.error(err);

    output.innerHTML =
      "❌ Quiz generation failed.";
  }
}

window.generateQuiz =
  generateQuiz;