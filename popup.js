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
      chrome.tabs.sendMessage(tabId, { message: "getH1s" }, (response) => {
        const h1List = document.getElementById("h1-list");

        if (response && response.h1Texts.length > 0) {
          // Send the extracted h1's to a dummy API
          fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              h1Texts: response.h1Texts, // Sending the array of h1 texts
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              // Display the response from the API in the popup
              h1List.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            })
            .catch((error) => {
              h1List.textContent = "Error sending data to the API.";
              console.error("Error:", error);
            });
        } else {
          h1List.textContent = "No H1 tags found.";
        }
      });
    }
  );
});
