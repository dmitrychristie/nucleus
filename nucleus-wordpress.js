  // Function to handle messages from parent
        window.addEventListener('message', function(event) {
            // Check origin for security (replace 'http://localhost:8080' with your actual parent URL)
            if (event.origin !== 'http://localhost:8080') {
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
            window.parent.postMessage('Hello from iframe!', 'http://localhost:8080');
        }, 2000); // Delayed action after 2 seconds
