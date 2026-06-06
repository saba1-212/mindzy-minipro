async function analyzeFile() {

  const fileInput =
    document.getElementById("studyFile");

  const file =
    fileInput.files[0];

  if (!file) {

    alert("Please upload a file.");

    return;
  }

  const fileType = file.type;

  /* =========================
     PDF FILE
  ========================= */

  if (fileType === "application/pdf") {

    const reader = new FileReader();

    reader.onload = async function () {

      const typedArray =
        new Uint8Array(reader.result);

      const pdf =
        await pdfjsLib.getDocument(
          typedArray
        ).promise;

      let fullText = "";

      for (
        let pageNum = 1;
        pageNum <= pdf.numPages;
        pageNum++
      ) {

        const page =
          await pdf.getPage(pageNum);

        const textContent =
          await page.getTextContent();

        const textItems =
          textContent.items.map(
            item => item.str
          );

        fullText +=
          textItems.join(" ") + "\n";
      }

      document.getElementById(
        "extractedText"
      ).value = fullText;
    };

    reader.readAsArrayBuffer(file);

  }

  /* =========================
     TEXT FILE
  ========================= */

  else if (
    fileType === "text/plain"
  ) {

    const reader =
      new FileReader();

    reader.onload = function (e) {

      document.getElementById(
        "extractedText"
      ).value = e.target.result;
    };

    reader.readAsText(file);
  }

  else {

    alert(
      "Unsupported file type."
    );
  }
}