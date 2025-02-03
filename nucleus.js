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

	var addBuildProduct = function ({ payload, next, integrations }) {
	    if (!payload.obj.context) {
		payload.obj.context = {};
	    }
	    if (typeof window.nucleusProduct !== 'undefined') {
		payload.obj.properties.build_product = window.nucleusProduct;
	    }
	    next(payload);
	};

	 analytics.addSourceMiddleware(addBuildProduct);

	if(window.nucleusGA4MeasurementId) { 
		const addGA4Properties = ({ payload, next, integrations }) => {
    try {
        payload.obj.context = payload.obj.context || {};

	let nucleusGA4MeasurementId = window.nucleusGA4MeasurementId || '';
        console.log(nucleusGA4MeasurementId);

        // Make sure nucleusGA4MeasurementId is long enough before calling substring
        if (nucleusGA4MeasurementId.length > 2) {
            nucleusGA4MeasurementId = nucleusGA4MeasurementId.substring(2);
        } else {
            throw new Error("nucleusGA4MeasurementId is too short");
        }

        nucleusGA4MeasurementId = '_' + nucleusGA4MeasurementId;
        console.log(nucleusGA4MeasurementId);

        const extractSessionNumber = (cookieValue) => {
            return Number(cookieValue.split('.')[3]);
        };

        if (nucleusGA4MeasurementId) {
            const ga4CookieName = `_ga${nucleusGA4MeasurementId}`;
            console.log("Constructed Cookie Name:", ga4CookieName);

            const getCookieValue = (cookieName) => {
                const cookiePattern = new RegExp('(?:(?:^|.*;\\s*)' + cookieName + '\\s*\\=\\s*([^;]*).*$)|^.*$');
                return document.cookie.replace(cookiePattern, "$1");
            };

            // Get the GA cookie value
            const ga4CookieValue = getCookieValue(ga4CookieName);
            if (!ga4CookieValue) {
                throw new Error("GA4 cookie not found");
            }

            function extractIds(cookieValue) {
                var ids = cookieValue.split('.');
                return {
                    sessionId: ids[2]
                };
            }

            var ids = extractIds(ga4CookieValue);

            function get_ga_clientid() {
                var cookie = {};
                document.cookie.split(';').forEach(function (el) {
                    var splitCookie = el.split('=');
                    var key = splitCookie[0].trim();
                    var value = splitCookie[1];
                    cookie[key] = value;
                });
                if (cookie["_ga"]) {
                    return cookie["_ga"].substring(6);
                } else {
                    throw new Error("GA client ID not found");
                }
            }

            let clientId = get_ga_clientid();

            // Extract session ID and session number from GA4 cookie
            if (ga4CookieValue.split('.').length >= 4) {
                const [, , sessionNumber, sessionId] = ga4CookieValue.split('.');
            } else {
                throw new Error("GA4 cookie is missing session information");
            }

            if (ids.sessionId) {
                payload.obj.properties.ga4_session_id = ids.sessionId;
            }

            if (clientId) {
                payload.obj.properties.ga4_client_id = clientId;
            }

            const sessionNum = extractSessionNumber(ga4CookieValue);
            if (!isNaN(sessionNum)) {
                payload.obj.properties.ga4_session_number = sessionNum;
            }
        }

        next(payload);
    } catch (error) {
        console.error("Error in addGA4Properties:", error);
        // Optionally, you can add any fallback behavior here or decide not to call next()
        next(payload);  // Ensure `next` is called even if there's an error
    }
};

analytics.addSourceMiddleware(addGA4Properties);
	} else {
console.log('Warning! GA4 Measurement ID is not defined');
}




var generateEventId = function({ payload, next }) {
          var eventId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
          payload.obj.properties = payload.obj.properties || {};
          payload.obj.properties.event_id = eventId;
          next(payload);
        };

        // Add the generateEventId middleware
analytics.addSourceMiddleware(generateEventId);





        // Function to look up the write key based on the domain name
      function getWriteKey() {
        var domain = window.location.hostname;
        var writeKeys = {
		"vendors.theknot.com": "7uNVcxnOSBpg3EinntFqHEo4Dqna4EEO",
		"landing.hitched.co.uk": "JAx81AikCaWgsRfRFmx6RBz953eGVHqH",
		"vendors.weddingpro.com": "3EbqDEUfCdJ1kbQ4AgVilzIGLG9LG9IC",
		"landing.bodas.net": "5BAtHFm8T7Ymq1GjecaP13EOeabFRCPM",
		"landing.mariages.net": "AeOWbj8QkZ3NS0MiwBVjANFTi70hCCMI",
		"landing.matrimonio.com": "Uvqhy9zLMpnhoCFzCz1oYIVFB7tiDJmz",
		"landing.hitched.ie": "PmpoRVhqM8qGy3KzkemKkvERtHVjO4Pj",
		"landing.bodas.com.mx": "cvBYtvnVbSuwGVWvGHuoa2e1hRfGUpGh",
		"landing.matrimonios.cl": "yJYUIT5WttG3A55MsLrflD5JekxDX7Z4",
		"landing.casamientos.com.ar": "Cm9lLLR3R7oVUnm55O28ypnlv07FoYdy",
		"landing.casamentos.com.br": "wgyqDswuS7ybSLeu8it8ISEXzbZvO52a",
		"landing.casamiento.com.uy": "c8loqfeocDRtMtcTGBa4jAR3t7B5febV",
		"landing.matrimonio.com.pe": "V4qUYRwsg4HWPyBCu86eEESqmMGC9w6V",
		"pros.weddingpro.com": "Scko6NfkLryer27iA7jqDaDYhw0JueFh",
		"www.theknotww.com": "UuP98lzDHr9SjV0GQyXPGEsS4O96OqPL",
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
        analytics.page('Page Viewed', {
	  non_interaction: false
	});
      }
    }
  }();



// Segment Events  
// Global variables
let formValuesCache = {};
let fbcCookie = getCookie('_fbc');
let fbpCookie = getCookie('_fbp');

// Form field mapping
const formFieldTraitMapping = [
  { inputName: 'first_name', traitName: 'firstName' },
  { inputName: 'last_name', traitName: 'lastName' },
  { inputName: 'email', traitName: 'email' },
  { inputName: 'phone_number', traitName: 'phone' },
  { inputName: 'company', traitName: 'company' },
  { inputName: 'country', traitName: 'country' },
  { inputName: 'input_1.3', traitName: 'firstName' },
  { inputName: 'input_1.6', traitName: 'lastName' },
  { inputName: 'input_2', traitName: 'email' },
  { inputName: 'input_5', traitName: 'phone' },
  { inputName: 'input_17', traitName: 'company' },
  { inputName: 'input_20', traitName: 'country' },
];

// Helper functions for transformations
const trimWhitespace = (value) => value.trim();
const toLowerCase = (value) => value.toLowerCase();
const removeSymbols = (value) => value.replace(/[^a-zA-Z0-9]/g, '');
const removeLeadingZeros = (value) => value.replace(/^0+/, '');
const formatPhoneNumber = (phone, countryCode = '1') => {
  const cleaned = removeSymbols(phone);
  const formatted = removeLeadingZeros(cleaned);
  return `${countryCode}${formatted}`;
};

const normalizeValue = (value, key) => {
  if (!value) return null;

  value = trimWhitespace(value);

  switch (key) {
    case 'firstName':
    case 'lastName':
    case 'city':
    case 'state':
    case 'zipCode':
    case 'country':
      value = toLowerCase(value);
      break;
    case 'phone':
      value = formatPhoneNumber(value); // Assume '1' as default country code for the example
      break;
    case 'email':
      value = value.toLowerCase();
      break;
    case 'dateOfBirth':
      value = value.replace(/[^0-9]/g, ''); // Keep only digits
      break;
    case 'gender':
      value = value.charAt(0).toLowerCase(); // Use first character
      break;
    default:
      break;
  }

  return value;
};

// Initialize tracking once the window is loaded
window.onload = function () {
  try {
    // Get all forms on the page
    const forms = document.querySelectorAll('form');

    forms.forEach((form) => {
      form.addEventListener('submit', (event) => formSubmittedTrack(event));

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

      // Capture the hidden field `Form_Type` in the cache
      const hiddenField = form.querySelector('input[name="Form_Type"]');
      if (hiddenField) {
        formValuesCache[hiddenField.name] = hiddenField.value; // Initialize with the value
      }

      // Update the cache for hidden fields on form submission
      form.addEventListener('submit', () => {
        if (hiddenField) {
          formValuesCache[hiddenField.name] = hiddenField.value; // Ensure it captures on submit
        }
      });
    });

  } catch (error) {
    console.error('Error initializing form tracking:', error);
  }
};

// Form submission tracking function
const formSubmittedTrack = (event) => {
  try {
    const formElement = event.target;
    const traits = {};
    let autofillDetected = false;

    // Map form field values to traits based on formFieldTraitMapping
    formFieldTraitMapping.forEach((mapping) => {
      // Get the value from the cache using the input name
      let value = formValuesCache[mapping.inputName] || null;
      console.log("Cache value for", mapping.inputName, ":", value);

      // Normalize the value if it exists
      if (value) {
        value = normalizeValue(value, mapping.traitName);
        console.log("Normalized value for", mapping.traitName, ":", value);
      }

      // Only add to traits if the value is not null
      if (value) {
        traits[mapping.traitName] = value;
      } else {
        console.log("No value for trait:", mapping.traitName); // Log if no value is assigned
      }
    });

    // Log to check final traits structure
    console.log("Final traits object to be sent to Segment:", traits);

    // Call the identify function from Segment with the final traits object
    analytics.identify(traits);

    // Track the form submission
    analytics.track(
      'Form Submitted',
      {
        form_id: formElement.parentElement.id,
        form_name: formElement.dataset.formName,
        form_type: formElement.dataset.formType,
        form_header: formElement.dataset.formHeader,
        form_type: formValuesCache['Form_Type'],
        form_description: formElement.dataset.formDescription,
        form_location: document.location.pathname,
        form_result: 'success',
        non_interaction: false,
        _fbc: fbcCookie || null,
        _fbp: fbpCookie || null,
      },
      {
        traits,
      }
    );

  } catch (error) {
    console.error('Error handling form submission:', error);
  }
};

document.addEventListener('gform/theme/scripts_loaded', () => {
  gform.utils.addAsyncFilter('gform/submission/pre_submission', async (data) => {
    const formElement = data.form;
	console.log(formElement);
    const traits = {};

    // Define the form field mapping
    const formFieldTraitMapping = [
      { inputName: 'first_name', traitName: 'firstName' },
      { inputName: 'last_name', traitName: 'lastName' },
      { inputName: 'email', traitName: 'email' },
      { inputName: 'phone_number', traitName: 'phone' },
      { inputName: 'company', traitName: 'company' },
      { inputName: 'country', traitName: 'country' },
    ];

    // Helper functions for transformations
    const trimWhitespace = (value) => value.trim();
    const toLowerCase = (value) => value.toLowerCase();
    const formatPhoneNumber = (phone, countryCode = '1') => {
      const cleaned = phone.replace(/[^a-zA-Z0-9]/g, '').replace(/^0+/, '');
      return `${countryCode}${cleaned}`;
    };

    // Normalize form values
    const normalizeValue = (value, key) => {
      if (!value) return null;

      value = trimWhitespace(value);

      switch (key) {
        case 'firstName':
        case 'lastName':
        case 'country':
          value = toLowerCase(value);
          break;
        case 'phone':
          value = formatPhoneNumber(value); // Assuming '1' as default country code
          break;
        case 'email':
          value = value.toLowerCase();
          break;
        default:
          break;
      }

      return value;
    };

    // Map form field values to traits based on formFieldTraitMapping
    formFieldTraitMapping.forEach((mapping) => {
      const field = gform.utils.getNode(`.gfield--type-${mapping.inputName} input`, formElement, true);
      if (field) {
        let value = field.value || null;

        // Normalize the value if it exists
        if (value) {
          value = normalizeValue(value, mapping.traitName);
        }

        // Only add to traits if the value is not null
        if (value) {
          traits[mapping.traitName] = value;
        }
      }
    });

    // Log the traits object to be sent to Segment (optional)
    console.log("Final traits object to be sent to Segment:", traits);

    // Call the identify function from Segment with the final traits object
    analytics.identify(traits);

    // Track the form submission event
    analytics.track(
      'Test Form Submitted',
      {
        form_id: formElement.parentElement.id,
        form_name: formElement.dataset.formName,
        form_type: formElement.dataset.formType,
        form_location: document.location.pathname,
        form_result: 'success',
	email: traits.email,
      },
      {
        traits,
      }
    );

    return data;
   
  });
});


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

// comment to trigger a new build job 

  return null;
}





// LINK and CTA Clicked

// Define an array of CSS classes that would classify the link as a CTA
const ctaClasses = ['cta', 'button', 'highlight', 'cta-learn-more']; // Add as many classes as needed

// Function to check if an element or its parent has a CTA class
const hasCTAClass = (element) => {
  return ctaClasses.some((ctaClass) =>
    element.classList.contains(ctaClass) ||
    (element.parentElement && element.parentElement.classList.contains(ctaClass))
  );
};

// Function to track event and navigate
const trackEventAndNavigate = (eventName, properties, href, target) => {
  return new Promise((resolve) => {
    analytics.track(eventName, properties, resolve); // Resolve only after tracking is complete
  }).then(() => {
    // After tracking is complete, navigate to the link
    if (target === '_blank') {
      // Open in a new tab
      window.open(href, '_blank');
    } else {
      // Navigate in the same tab
      window.location.href = href;
    }
  });
};

// Event listener for link clicks
document.addEventListener('click', (event) => {
  const linkElement = event.target.closest('a'); // Find the nearest <a> element

  if (linkElement) {
    const href = linkElement.href;
    const target = linkElement.target; // Capture the target attribute

    // Determine link type
    const linkType = linkElement.hostname === window.location.hostname ? 'internal' : 'external';

    // Check if the link qualifies as a CTA based on the CSS classes
    const isCTA = hasCTAClass(linkElement);

    // Track either "CTA Clicked" or "Link Clicked"
    const eventName = isCTA ? 'CTA Clicked' : 'Link Clicked';
    const properties = {
      link_type: linkType,
      href: href,
    };

    if (target === '_blank' || event.ctrlKey || event.metaKey) {
      // Allow default behavior for new tab or command/ctrl click
      analytics.track(eventName, properties);
    } else {
      // Prevent immediate navigation and track before navigating
      event.preventDefault();
      trackEventAndNavigate(eventName, properties, href, target);
    }
  }
});
