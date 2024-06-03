function handleFormSubmission(event) {
    // Prevent form submission

    // Send a message to parent when form is submitted
    window.parent.postMessage('Form submitted from iframe!', 'https://weddingpro-com-staging.go-vip.net');
}

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the form for submission if the form exists
    var form = document.getElementById('pardot-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
});
