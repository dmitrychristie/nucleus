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
  var totalElement = document.querySelectorAll('table.table-bordered tfoot td.text-right')[1];
  var total = totalElement ? totalElement.textContent.trim() : '0,00€';

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

  // Check for the button every second
  var checkButtonInterval = setInterval(function() {
    var checkoutButton = document.querySelector('#quick-checkout-button-confirm');
    if (checkoutButton) {
      console.log('Button found.');

      // Add event listener once button is found
      checkoutButton.addEventListener('click', function() {
        extractDataAndSetLocalStorage();
      });

      // Clear the interval since we found the button
      clearInterval(checkButtonInterval);
    } else {
      console.log('Button not found.');
    }
  }, 1000);
} else {
  console.log("Consent is not granted");
}
