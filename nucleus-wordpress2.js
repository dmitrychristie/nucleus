// Function to handle messages from the iframe
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
        console.log('attempting to push the data layer event');        
        pushDataLayerEvent(event.data);
    }
}

// Listen for messages from the iframe
window.addEventListener('message', receiveMessageFromIframe);

// Function to push a dataLayer event
function pushDataLayerEvent(data) {
    // Push the received data to the dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
}


