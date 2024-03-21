    window.addEventListener('message', function(event) {
            // Check origin for security (replace 'https://weddingpro-com-staging.go-vip.net' with your actual parent URL)
            if (event.origin !== 'https://weddingpro-com-staging.go-vip.net') {
                console.error('Received message from invalid origin:', event.origin);
                return;
            }

            // Handle the message received from parent
            console.log('Message received from parent:', event.data);
            // You can process the data received from parent here
        });

        // Timeout to simulate delayed action (replace with your actual logic)
        setTimeout(function() {
            // Send a message to parent
            window.parent.postMessage('Hello from iframe!', 'https://weddingpro-com-staging.go-vip.net');
        }, 2000); // Delayed action after 2 seconds
