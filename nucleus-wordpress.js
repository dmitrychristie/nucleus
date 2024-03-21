     function handleFormSubmission(event) {
            // Prevent form submission
            event.preventDefault();

            // Send a message to parent when form is submitted
            window.parent.postMessage('Form submitted from iframe!', 'https://weddingpro-com-staging.go-vip.net');
        }

        // Wait for DOM content to be fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Add event listener to the form for submission
            var form = document.getElementById('pardot-form');
            form.addEventListener('submit', handleFormSubmission);
        });
