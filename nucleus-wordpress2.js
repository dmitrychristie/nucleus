// Function to handle messages from the iframe
function receiveMessageFromIframe(event) {
    // Check origin for security (replace 'https://go.weddingpro.com' with your actual iframe URL)
    if (event.origin !== 'https://go.weddingpro.com') {
        console.error('Received message from invalid origin:', event.origin);
        return;
    }

    // Check the message received
    if (event.data === 'FormSubmitted') {
        // Trigger the Segment event here
        triggerSegmentEvent();
    }
}

// Function to trigger Segment event (replace with your actual Segment code)
function triggerSegmentEvent() {
    // Replace 'your_segment_event_name' with your actual Segment event name
    analytics.track('Form Submitted', {
        category: 'Form Submission',
        action: 'Submit',
        label: 'Iframe Form Submitted'
    });
}

// Listen for messages from the iframe
window.addEventListener('message', receiveMessageFromIframe);

// Function to load Segment analytics.js script
(function() {
    var analytics = window.analytics = window.analytics || [];
    if (!analytics.initialize) {
        if (analytics.invoked) {
            window.console && console.error && console.error("Segment snippet included twice.");
        } else {
            analytics.invoked = !0;
            analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "reset", "group", "track", "ready", "alias", "debug", "page", "once", "off", "on"];
            analytics.factory = function(t) {
                return function() {
                    var e = Array.prototype.slice.call(arguments);
                    e.unshift(t);
                    analytics.push(e);
                    return analytics;
                };
            };
            for (var t = 0; t < analytics.methods.length; t++) {
                var e = analytics.methods[t];
                analytics[e] = analytics.factory(e);
            }
            analytics.load = function(t, e) {
                var n = document.createElement("script");
                n.type = "text/javascript";
                n.async = !0;
                n.src = "https://cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js";
                var a = document.getElementsByTagName("script")[0];
                a.parentNode.insertBefore(n, a);
                analytics._loadOptions = e;
            };
            analytics.SNIPPET_VERSION = "4.13.2";
            analytics.load("your_segment_write_key");
        }
    }
})();
