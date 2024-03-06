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
          "vendors.theknot.co": "7uNVcxnOSBpg3EinntFqHEo4Dqna4EETTTTT",
          // Add more domain-key pairs as needed
        };

        // Check if the domain exists in the writeKeys object
        if (writeKeys.hasOwnProperty(domain)) {
          return writeKeys[domain];
        } else {
          // If the domain is not found, return a fallback key
          return "7uNVcxnOSBpg3EinntFqHEo4Dqna4EEO";
        }
      }
		
        analytics._writeKey = getWriteKey();
        analytics.SNIPPET_VERSION = "4.15.3";
        analytics.load(analytics._writeKey);
        analytics.page('Page Viewed');
      }
    }
  }();


  
  
// Segment Events  
  
window.onload = function () {
  try {
   
    const formValuesCache = {};

    const form = document.querySelector('.lp-pom-form form');

    if (form) {
      form.addEventListener('submit', (event) => formSubmittedTrack(event, formValuesCache));

      // Add an event listener to each input field for real-time updates
      const inputFields = form.querySelectorAll('input, textarea, select');
      inputFields.forEach((inputField) => {
        inputField.addEventListener('input', () => {
          // Only update the cache if the input value is not empty
          if (inputField.value.trim() !== '') {
            // Update the cache with the latest value
            formValuesCache[inputField.name] = inputField.value;
            console.log('Updated Form Values:', formValuesCache);
          }
        });
      });
    } else {
      console.warn("Form element not found.");
    }

  } catch (error) {
    console.error('Error initializing form tracking:', error);
  }
};

const formFieldTraitMapping = [
  { inputName: 'first_name', traitName: 'firstName' },
  { inputName: 'last_name', traitName: 'lastName' },
  { inputName: 'email', traitName: 'email' },
  { inputName: 'phone_number', traitName: 'phone' },
  { inputName: 'company', traitName: 'company' },
  { inputName: 'country', traitName: 'country' },
];
  
  
const fbcCookie = getCookie('_fbc');
const fbpCookie = getCookie('_fbp');
  

const formSubmittedTrack = (event, formValuesCache) => {
  try {
    const formElement = event.target;
    const traits = {
      firstName: formValuesCache['first_name'] || null,
      lastName: formValuesCache['last_name'] || null,
      email: formValuesCache['email'] || null,
      phone: formValuesCache['phone_number'] || null,
      company: formValuesCache['company'] || null,
      country: formValuesCache['country'] || null,
    };

    // Call the identify function from Segment with only traits
    analytics.identify(traits);

    // Track the form submission
    analytics.track(
      'Form Submitted',
      {
        form_id: formElement.parentElement.id,
        form_name: formElement.dataset.formName,
        form_type: formElement.dataset.formType,
        form_header: formElement.dataset.formHeader,
        form_description: formElement.dataset.formDescription,
        form_location: document.location.pathname,
        form_result: 'success',
        _fbc: fbcCookie || null, // Add _fbc property with the value from the fbcCookie
        _fbp: fbpCookie || null, // Add _fbp property with the value from the fbpCookie
      },
      {
        traits,
      }
    );

  } catch (error) {
    console.error('Error handling form submission:', error);
  }
};

  
function getCookie(cookieName) {
  const name = cookieName + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}



