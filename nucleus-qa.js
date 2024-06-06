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

	var addGA4Properties = function ({ payload, next, integrations }) {
	    if (!payload.obj.context) {
		payload.obj.context = {};
	    }
	
	    function getCookieValue(cookieName) {
		const cookiePattern = new RegExp('(?:(?:^|.*;\\s*)' + cookieName + '\\s*\\=\\s*([^;]*).*$)|^.*$');
		return document.cookie.replace(cookiePattern, "$1");
	    }
	
	    // Add ga4_client_id from cookie
	    const ga4ClientId = getCookieValue('_ga');
	    if (ga4ClientId) {
		payload.obj.properties.ga4_client_id = ga4ClientId.split('.').slice(-2).join('.');
	    }
	
	    // Add ga4_session_id from cookie
	    const ga4SessionId = getCookieValue('_ga');
	    if (ga4SessionId) {
		payload.obj.properties.ga4_session_id = ga4SessionId.split('.').slice(2, 3).join('.');
	    }
	
	    // Add ga4_session_number from cookie
	    const ga4SessionNumber = getCookieValue('_ga');
	    if (ga4SessionNumber) {
		payload.obj.properties.ga4_session_number = Number(ga4SessionNumber.split('.').slice(-1)[0]);
	    }
	
	    next(payload);
	};

	analytics.addSourceMiddleware(addGA4Properties);

	
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
        analytics.page('Page Viewed', {
	  non_interaction: true
	});
      }
    }
  }();


  
// Segment Events  
  
window.onload = function () {
  try {
    const formValuesCache = {};

    // Get all forms on the page
    const forms = document.querySelectorAll('form');

    forms.forEach((form) => {
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
  
const fbcCookie = getCookie('_fbc');
const fbpCookie = getCookie('_fbp');
  
const formSubmittedTrack = (event, formValuesCache) => {
  try {
    const formElement = event.target;
    const traits = {};

    // Map form field values to traits based on formFieldTraitMapping
    formFieldTraitMapping.forEach((mapping) => {
      traits[mapping.traitName] = formValuesCache[mapping.inputName] || null;
    });

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
        non_interaction: false,
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





