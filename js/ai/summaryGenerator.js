async function generateSummary() {

  const textArea =
    document.getElementById("extractedText");

  const output =
    document.getElementById("aiOutput");

  if (!textArea) {

    console.error("Textarea not found");

    return;
  }

  const text = textArea.value;

  if (!text.trim()) {

    output.innerHTML =
      "❌ Please analyze content first.";

    return;
  }

  output.innerHTML =
    "⏳ Generating AI Summary...";

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
              role: "system",

              content:
                "You are a helpful AI study assistant."
            },

            {
              role: "user",

              content:
                `Summarize this study material in easy points:\n\n${text.substring(0, 4000)}`
            }

          ],

          temperature: 0.5,

          max_tokens: 500

        })

      }
    );

    const data =
      await response.json();

    console.log(data);

    /* =========================
       HANDLE API ERROR
    ========================= */

    if (data.error) {

      output.innerHTML = `

        <div class="ai-result">

          <h2>❌ API Error</h2>

          <p>
            ${data.error.message}
          </p>

        </div>

      `;

      return;
    }

    const summary =
      data.choices[0].message.content;

    output.innerHTML = `

      <div class="ai-result">

        <h2>📄 AI Summary</h2>

        <p>${summary}</p>

      </div>

    `;

  }

  catch (error) {

    console.error(error);

    output.innerHTML =
      "❌ Error generating summary";
  }

}

window.generateSummary =
  generateSummary;