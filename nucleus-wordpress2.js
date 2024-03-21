function receiveMessageFromIframe(event) {
    // Check origin for security (replace 'https://go.weddingpro.com' with your actual iframe URL)
    if (event.origin !== 'https://go.weddingpro.com') {
        console.error('Received message from invalid origin:', event.origin);
        return;
    }

    // Display the received message
    console.log('Message received from iframe:', event.data);

    // Trigger the same event in the parent window
    if (event.data && event.data.event === 'b2bFormSubmission') {
        handleFormSubmissionInParent(event.data.frameHREF);
    }
}

// Listen for messages from the iframe
window.addEventListener('message', receiveMessageFromIframe);

// Function to handle form submission in the parent window
function handleFormSubmissionInParent(frameHREF) {
    console.log('Handling form submission in parent for frameHREF:', frameHREF);

    // Add your code here to handle the form submission in the parent window
    // This is where you would trigger your 'segmentFormSubmitted' event or any other action
    // For example:
    // gtag('event', 'segmentFormSubmitted', { 'frameHREF': frameHREF });
}

// Function to send a message to the iframe (optional)
function sendMessageToIframe() {
    var iframe = document.getElementById('yourIframeId');
    if (iframe) {
        iframe.contentWindow.postMessage('Hello from parent!', 'https://go.weddingpro.com');
    } else {
        console.error('Could not find iframe with specified ID.');
    }
}
