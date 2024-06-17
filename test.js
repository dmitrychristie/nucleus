// Function to check if the URL is external
function isExternalLink(url, currentHost) {
    const linkHostname = new URL(url).hostname;
    // Split the hostnames into parts
    const linkParts = linkHostname.split('.').reverse();
    const currentParts = currentHost.split('.').reverse();
    
    // Determine the length of the shorter hostname parts
    const length = Math.min(linkParts.length, currentParts.length);
    
    // Compare the parts of both hostnames
    for (let i = 0; i < length; i++) {
        if (linkParts[i] !== currentParts[i]) {
            return true; // Part mismatch means the link is external
        }
    }
    return false; // All parts match means the link is internal
}

// Function to add 'nucleus-external-link' class to external links
function tagExternalLinks() {
    const links = document.querySelectorAll('a'); // Select all links on the page
    const hostname = window.location.hostname; // Get the current site's hostname

    links.forEach(link => {
        if (isExternalLink(link.href, hostname)) {
            link.classList.add('nucleus-external-link'); // Add class if the link is external
        }
    });
}

// Function to handle link click events
function handleLinkClick(event) {
    const link = event.target.closest('a'); // Get the closest <a> element in case of nested elements

    if (link) {
        const isExternal = link.classList.contains('nucleus-external-link');
        const eventDetails = {
            event: 'Link Clicked',
            link_type: isExternal ? 'external' : 'internal',
            href: link.href
        };

        // Fire the event (assuming a function 'fireEvent' is defined to handle this)
        fireEvent(eventDetails);
    }
}

// Function to fire the event (you can customize this as per your analytics setup)
function fireEvent(details) {
    console.log(details); // For debugging, you can replace this with actual event firing code
    // For example, if using Google Analytics:
    // gtag('event', 'click', details);
}

// Tag external links on page load
document.addEventListener('DOMContentLoaded', tagExternalLinks);

// Add click event listener to the whole document
document.addEventListener('click', handleLinkClick);
