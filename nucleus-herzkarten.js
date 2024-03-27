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

// Example usage
if (isConsentGranted()) {
  console.log("Consent is granted");

  // Initialize Segment analytics only if consent is granted
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
            "partecipazioni.matrimonio.com": "UCwS4l4zqdAIKlM4Osi7cvGFD6RfCoTL"
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


// Collect the data for the Order Completed Event
// Function to extract data from the HTML and set it in localStorage
function extractDataAndSetLocalStorage() {
  var products = [];

  // Loop through each product row in the table
  var productRows = document.querySelectorAll('table.table-bordered tbody tr');
  productRows.forEach(function(row) {
    var product = {
      product_id: '', // You may need to fetch this from your backend or database
      sku: row.querySelector('.td-model').textContent.trim(),
      category: '', // You may need to fetch this based on the product
      name: row.querySelector('.td-product a').textContent.trim(),
      brand: '', // You may need to fetch this based on the product
      variant: row.querySelector('.td-product small').textContent.trim(),
      price: parseFloat(row.querySelector('.td-price').textContent.replace('€', '').trim()),
      quantity: parseInt(row.querySelector('.td-qty select').value), // Assuming it's a dropdown
      coupon: '', // You may need to fetch this based on the product
      position: Array.from(row.parentNode.children).indexOf(row) + 1, // Position in the list
      url: row.querySelector('.td-product a').href,
      image_url: row.querySelector('.td-image img').src
    };
    products.push(product);
  });

  // Extract the total from the table
  var total = document.querySelectorAll('table.table-bordered tfoot td.text-right')[1].textContent.trim();

  // Prepare the data for localStorage
  var data = {
    checkout_id: '', // You may need to generate this
    order_id: '', // You may need to generate this
    affiliation: '', // Store or affiliation
    subtotal: 0, // Not available from HTML
    total: parseFloat(total.replace('€', '').trim()), // Total price
    revenue: 0, // Not available from HTML
    shipping: 0, // Not available from HTML
    tax: 0, // Not available from HTML
    discount: 0, // Not available from HTML
    coupon: '', // Not available from HTML
    currency: 'EUR',
    products: products
  };

  // Set the data in localStorage
  localStorage.setItem('order_completed_data', JSON.stringify(data));

  console.log('Order data stored in localStorage.');
}

// Check if the current URL path matches /index.php?route=checkout/checkout
var currentURL = window.location.href;
var targetPath = '/index.php?route=checkout/checkout';

if (currentURL.indexOf(targetPath) !== -1) {
  console.log('On the checkout page. Ready to extract data.');

  // Get the "COMPLETA L'ORDINE" button and add event listener
  var checkoutButton = document.querySelector('#quick-checkout-button-confirm');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
      extractDataAndSetLocalStorage();
    });
  } else {
    console.error('Button not found.');
  }
}



} else {
  console.log("Consent is not granted");
}
