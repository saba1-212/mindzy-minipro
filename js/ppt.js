let slides = [];

document.addEventListener("DOMContentLoaded", () => {
  const tab = document.getElementById("slide-tab");

  if (!tab) return;

  tab.innerHTML = `
    <div style="max-width: 600px; margin: auto; padding: 20px;">
      <h2>🎞️ In-App Slide Creator</h2>

      <input type="text" id="slideTitle" placeholder="Slide Title" style="width: 100%; padding: 10px; margin-bottom: 10px;" />

      <textarea id="slideContent" placeholder="Slide Content" rows="5" style="width: 100%; padding: 10px;"></textarea>

      <div style="margin-top: 10px;">
        <button onclick="addSlide()">➕ Add Slide</button>
        <button onclick="exportSlidesAsPDF()">📤 Export as PDF</button>
      </div>

      <hr style="margin: 30px 0;">

      <h3>🧾 Slide Preview</h3>
      <ul id="slidePreview" style="list-style: none; padding-left: 0;"></ul>
    </div>
  `;

  displaySlides();
});

function addSlide() {
  const title = document.getElementById("slideTitle").value.trim();
  const content = document.getElementById("slideContent").value.trim();

  if (!title && !content) {
    alert("Please enter slide content.");
    return;
  }

  slides.push({ title, content });
  displaySlides();

  document.getElementById("slideTitle").value = "";
  document.getElementById("slideContent").value = "";
}

function displaySlides() {
  const preview = document.getElementById("slidePreview");
  if (!preview) return;

  preview.innerHTML = slides.map((s, i) => `
    <li style="margin-bottom: 15px; padding: 10px; background: #eef4ff; border-radius: 6px;">
      <strong>Slide ${i + 1}:</strong><br/>
      <strong>${s.title}</strong><br/>
      ${s.content}
    </li>
  `).join("");
}

async function exportSlidesAsPDF() {
  if (slides.length === 0) {
    alert("No slides to export.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  slides.forEach((slide, index) => {
    if (index > 0) doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(slide.title, 20, 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(slide.content, 160), 20, 50);
  });

  doc.save("Mindzy_Presentation.pdf");
}
function switchTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach(tab => tab.classList.remove("active"));

  const activeTab = document.getElementById(`${tabId}-tab`);
  if (activeTab) activeTab.classList.add("active");
}
