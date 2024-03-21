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
	      analytics.page();
      }
    }
  }();

const debugMode = getCookie('debug_mode');
const isDebugMode = debugMode === 'true';

if (isDebugMode) {
	console.log('Debug mode enabled');
}


  // Function to handle tracking event
        function trackEvent(eventName) {
            // Replace this with your actual GA4 tracking code
            console.log('Tracking event:', eventName);
            // Example: Send GA4 event
            // gtag('event', 'click', { 'event_category': 'Button Click', 'event_label': eventName });
        }

        // Function to search for the iframe and attach event listeners
        function searchAndAttachListeners() {
            var iframe = document.getElementById('pardot-homepagetab-form-iframe-1');

            if (iframe) {
                iframe.addEventListener('load', function() {
                    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                    var buttonInIframe = iframeDocument.querySelector('input[type="submit"][value="Get in touch"]');

                    if (buttonInIframe) {
                        buttonInIframe.addEventListener('click', function() {
                            // Track the click event here
                            trackEvent('Submit_Button_Clicked_In_Iframe');
                        });
                    } else {
                        console.error('Button not found in iframe.');
                    }
                });
            } else {
                console.error('Could not find iframe with specified ID (pardot-homepagetab-form-iframe-1). Retrying in 1 second...');
                setTimeout(searchAndAttachListeners, 1000); // Retry after 1 second
            }

            // Check if GA4 event listeners are attached
            if (typeof gtag === 'undefined') {
                console.error('GA4 event listeners not attached. Check your GA4 setup.');
            }
        }

        // Call the function to search for the iframe and attach listeners
        searchAndAttachListeners();

// Segment Events  
  
window.onload = function () {
  try {
    const formValuesCaches = {};

    const processForm = (form) => {
      if (form) {
        const formId = form.getAttribute('id') || 'form_' + Math.random().toString(36).substring(2, 15);
        const formValuesCache = formValuesCaches[formId] || {};

        form.addEventListener('submit', (event) => formSubmittedTrack(event, form, formValuesCache));

        const inputFields = form.querySelectorAll('input, textarea, select');
        inputFields.forEach((inputField) => {
          inputField.addEventListener('input', () => {
            if (inputField.value.trim() !== '') {
              formValuesCache[inputField.name] = inputField.value;
              console.log('Updated Form Values:', formValuesCache);
            }
          });
        });

        formValuesCaches[formId] = formValuesCache;
      } else {
        console.warn("Form element not found.");
      }
    };

    // Process forms in main document
    const mainDocumentForms = document.querySelectorAll('.form');
    mainDocumentForms.forEach((form) => {
      processForm(form);
    });

    // Process forms in iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      try {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const iframeForms = iframeDocument.querySelectorAll('.form');
        iframeForms.forEach((form) => {
          processForm(form);
        });
      } catch (error) {
        console.error('Error accessing iframe content:', error);
      }
    });

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

const formSubmittedTrack = (event, formElement, formValuesCache) => {
  try {
    const traits = formFieldTraitMapping.reduce((acc, field) => {
      acc[field.traitName] = formValuesCache[field.inputName] || null;
      return acc;
    }, {});

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
        _fbc: fbcCookie || null,
        _fbp: fbpCookie || null,
      },
      { traits }
    );

  } catch (error) {
    console.error('Error handling form submission:', error);
  }
};


  
function getCookie(cookieName) {
  const name = cookieName + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  const currentDomain = window.location.hostname;

  // Always set cookies for the root domain
  const rootDomain = currentDomain.split('.').slice(-2).join('.');

  // Function to get query parameter value from URL
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  // Check if _fbp cookie exists
  let fbpCookie = cookieArray.find((cookie) => cookie.trim().startsWith('_fbp='));
  if (!fbpCookie) {
    const subdomainIndex = 1;
    const creationTime = Date.now();
    const randomnumber = Math.floor(Math.random() * 10000000000);
    fbpCookie = `_fbp=fb.${subdomainIndex}.${creationTime}.${randomnumber};domain=${rootDomain};path=/;max-age=63072000;SameSite=None;Secure`;
    document.cookie = fbpCookie;
    return fbpCookie.split('=')[1];
  }

  // Check if _fbc cookie should be generated
  if (cookieName === '_fbc' && getQueryParam('fbclid')) {
    const subdomainIndex = 1;
    const creationTime = Date.now();
    const fbclid = getQueryParam('fbclid');
    const fbcCookieValue = `_fbc=fb.${subdomainIndex}.${creationTime}.${fbclid};domain=${rootDomain};path=/;max-age=63072000;SameSite=None;Secure`;
    document.cookie = fbcCookieValue;
    return fbclid;
  }

  // If cookie is not found, return null
  const foundCookie = cookieArray.find((cookie) => cookie.trim().startsWith(`${name}`));
  if (foundCookie) {
    return foundCookie.split('=')[1];
  }

  return null;
}
