function getOptanonConsentCookie() {
  var name = "OptanonConsent=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(';');
  for(var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

// Function to check if consent is granted based on the OptanonConsent cookie
function isConsentGranted() {
  var optanonConsent = getOptanonConsentCookie();
  if (optanonConsent.indexOf("C0002:1") !== -1) {
    return true; // "C0002:1" is present, consent is granted
  } else {
    return false; // "C0002:1" is not present, consent is not granted
  }
}

// for now, we're only tracking anaylytics, so we need to check for other groups in the future version



// Example usage
if (isConsentGranted()) {
  console.log("Consent is granted");
	
!function(){
    var analytics = window.analytics = window.analytics || [];
    
    if (!analytics.initialize) {
      if (analytics.invoked) {
        window.console && console.error && console.error("Segment snippet included twice.");
      } else {
        analytics.invoked = !0;
        analytics.methods = ["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];
        
        analytics.factory = function(e){
          return function(){
            var t = Array.prototype.slice.call(arguments);
            t.unshift(e);
            analytics.push(t);
            return analytics;
          }
        };
        
        for (var e = 0; e < analytics.methods.length; e++) {
          var key = analytics.methods[e];
          analytics[key] = analytics.factory(key);
        }

        analytics.load = function(key, e){
          var t = document.createElement("script");
          t.type = "text/javascript";
          t.async = !0;
          t.src = "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";
          var n = document.getElementsByTagName("script")[0];
          n.parentNode.insertBefore(t, n);
          analytics._loadOptions = e;
        };
        
        // Function to look up the write key based on the domain name
      function getWriteKey() {
        var domain = window.location.hostname;
        var writeKeys = {
		"vendors.theknot.com": "7uNVcxnOSBpg3EinntFqHEo4Dqna4EEO",
		"landing.hitched.co.uk": "JAx81AikCaWgsRfRFmx6RBz953eGVHqH",
		"vendors.weddingpro.com": "3EbqDEUfCdJ1kbQ4AgVilzIGLG9LG9IC",
	
          // Add more domain-key pairs as needed
        };
	console.log(domain);
        // Check if the domain exists in the writeKeys object
        if (writeKeys.hasOwnProperty(domain)) {
          return writeKeys[domain];
        } else {
          // If the domain is not found, return a fallback key
          return "XeEJN55FrsKZFzBKqtu6wqnWRaZmXoKK";
        }
      }
		
        analytics._writeKey = getWriteKey();
        analytics.SNIPPET_VERSION = "4.15.3";
        analytics.load(analytics._writeKey);
        analytics.page('Page Viewed');
      }
    }
  }();






} else {
  console.log("Consent is not granted");
}
