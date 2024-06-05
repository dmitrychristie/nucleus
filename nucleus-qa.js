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
            
            // Function to get GA4 properties from cookies
            function getGA4Properties() {
                function getCookie(name) {
                    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                    return match ? match[2] : null;
                }
                
                var ga4ClientId = getCookie('_ga');
                var ga4SessionId = getCookie('_ga_s');
                var ga4SessionNumber = getCookie('_ga_sn');
                
                return {
                    ga4_client_id: ga4ClientId ? ga4ClientId.match(/\d{9,}\.\d*/)?.[0] : null,
                    ga4_session_id: ga4SessionId ? ga4SessionId.match(/\d{9,}/)?.[0] : null,
                    ga4_session_number: ga4SessionNumber ? ga4SessionNumber.match(/\d{9,}/)?.[0] : null
                };
            }

            // Add middleware to include GA4 properties
            analytics.addSourceMiddleware(function(event, next) {
                try {
                    var ga4Properties = getGA4Properties();
                    event.properties = event.properties || {};
                    if (ga4Properties.ga4_client_id) {
                        event.properties.ga4_client_id = ga4Properties.ga4_client_id;
                    }
                    if (ga4Properties.ga4_session_id) {
                        event.properties.ga4_session_id = ga4Properties.ga4_session_id;
                    }
                    if (ga4Properties.ga4_session_number) {
                        event.properties.ga4_session_number = ga4Properties.ga4_session_number;
                    }
                    next(event);
                } catch (error) {
                    console.error("Error in Source Middleware: ", error);
                    next(event);
                }
            });

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
