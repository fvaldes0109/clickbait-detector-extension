// Create a context menu that appears when right-clicking a link
chrome.contextMenus.create({
    id: 'clickbaitTitle',
    title: 'Evaluate Title',
    contexts: ['link'],
    });

    // Add a listener for the context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'clickbaitTitle') {
        // Send the info to the api and display the result
        fetch('http://localhost:8000/prob-by-title', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: info.linkText }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(`The title is ${(parseFloat(data.probability) * 100).toFixed(2)}% clickbait.`);
            })
            .catch((error) => {
                alert('Error sending data to the API.');
                console.error('Error:', error);
            });
    }
});
