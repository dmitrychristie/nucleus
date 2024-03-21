window.addEventListener('message', function(event) {
            // Check origin for security (replace 'http://localhost:8080' with your actual iframe URL)
            if (event.origin !== 'http://localhost:8080') {
                console.error('Received message from invalid origin:', event.origin);
                return;
            }

            // Handle the message received from iframe
            console.log('Message received from iframe:', event.data);
            // You can process the data received from iframe here
        });

        // Timeout to check if iframe is loaded
        var iframe = document.getElementById('myIframe');
        var checkIframeLoaded = function() {
            if (iframe.contentWindow) {
                // Iframe is loaded, send a message to iframe
                iframe.contentWindow.postMessage('Hello from parent!', 'http://localhost:8080');
            } else {
                // Iframe is not yet loaded, try again after 1 second
                setTimeout(checkIframeLoaded, 1000);
            }
        };

        // Start checking if iframe is loaded
        checkIframeLoaded();
