async function analyzeYouTube() {

  const url =
    document.getElementById(
      "youtubeUrl"
    ).value.trim();

  if (!url) {
    alert("Paste a YouTube URL");
    return;
  }

  let videoId = "";

  try {

    const parsedUrl =
      new URL(url);

    videoId =
      parsedUrl.searchParams.get("v");

  }

  catch {

    alert("Invalid YouTube URL");
    return;

  }

  if (!videoId) {

    alert(
      "Video ID not found"
    );

    return;
  }

  try {

    document.getElementById(
      "aiOutput"
    ).innerHTML =
      "⏳ Fetching transcript...";

    const response =
      await fetch(
        "http://localhost:3000/youtube-transcript",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            videoId
          })
        }
      );

    const data =
      await response.json();

    if (!data.success) {

      throw new Error(
        data.message
      );

    }

    document.getElementById(
      "extractedText"
    ).value =
      data.transcript;

    document.getElementById(
      "aiOutput"
    ).innerHTML =
      "✅ Transcript loaded successfully";

  }

  catch(error) {

    console.error(error);

    document.getElementById(
      "aiOutput"
    ).innerHTML =
      "❌ Could not fetch transcript";

  }

}