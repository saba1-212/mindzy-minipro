async function generateFlowchart() {

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
    "⏳ Generating Flowchart...";

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
Convert this study material into a flowchart hierarchy.

Example:

Main Topic
 ├─ Concept 1
 │   ├─ Subtopic
 │   └─ Subtopic
 └─ Concept 2

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

        <h2>🔀 Flowchart Structure</h2>

        <pre>
${data.choices[0].message.content}
        </pre>

      </div>

    `;

  } catch (err) {

    console.error(err);

    output.innerHTML =
      "❌ Flowchart generation failed.";
  }
}

window.generateFlowchart =
  generateFlowchart;