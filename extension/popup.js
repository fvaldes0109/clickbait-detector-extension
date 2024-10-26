// Query the currently active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tabId = tabs[0].id;

  // Inject the content script into the active tab
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      files: ["content.js"],
    },
    () => {
      // After injecting the content script, send a message to retrieve H1 elements
      chrome.tabs.sendMessage(tabId, { message: "sendContent" }, (response) => {
        const resultElement = document.getElementById("result-element");

        if (response && response.h1Texts.length > 0) {
          // Send the extracted h1's to a dummy API
          fetch("http://localhost:8000/prob-by-page", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              titles: response.h1Texts,
              text: response.text,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              // Display the response from the API in the popup
              const confidence = data.probability;
              resultElement.innerHTML = `<h2>${(parseFloat(confidence) * 100).toFixed(2)}%</h2>`;
            })
            .catch((error) => {
              resultElement.textContent = "Error sending data to the API.";
              console.error("Error:", error);
            });
        } else {
          resultElement.textContent = "No H1 tags found.";
        }
      });
    }
  );
});
