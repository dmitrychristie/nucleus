function receiveMessageFromIframe(event) {
    // Check origin for security (replace 'https://go.weddingpro.com' with your actual iframe URL)
    if (event.origin !== 'https://go.weddingpro.com') {
        console.error('Received message from invalid origin:', event.origin);
        return;
    }

    // Display the received message
    console.log('Message received from iframe:', event.data);

    // You can display the message in a specific element or do any other processing here
    var messageElement = document.getElementById('receivedMessage');
    if (messageElement) {
        messageElement.textContent = JSON.stringify(event.data, null, 2);
    }
}

// Listen for messages from the iframe
window.addEventListener('message', receiveMessageFromIframe);

// Function to handle sending messages to the iframe (optional)
function sendMessageToIframe() {
    var iframe = document.getElementById('yourIframeId');
    if (iframe) {
        iframe.contentWindow.postMessage('Hello from parent!', 'https://go.weddingpro.com');
    } else {
        console.error('Could not find iframe with specified ID.');
    }
}
