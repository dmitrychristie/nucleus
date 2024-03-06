


  
  
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
    const data = {};

    // Update formValuesCache with the latest non-empty values from the form
    const inputFields = formElement.querySelectorAll('input, textarea, select');
    inputFields.forEach((inputField) => {
      const name = inputField.name;
      const value = inputField.value.trim(); // Trim to handle whitespace-only values

      if (value !== '') {
        formValuesCache[name] = value;
      }
    });

    // Populate data object with the values from formValuesCache
    Object.keys(formValuesCache).forEach((name) => {
      // Exclude checkboxes from additional properties
      const isCheckbox = formElement.querySelector(`[name="${name}"][type="checkbox"]`);
      if (!isCheckbox) {
        data[name] = formValuesCache[name];
      }
    });

    console.log('Form Data:', formValuesCache);
    console.log('Cached Form Values:', data);

    const traits = {};
    formFieldTraitMapping.forEach((mapping) => {
      const { inputName, traitName } = mapping;
      if (data[inputName]) {
        traits[traitName] = data[inputName];
      }
    });


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
        _fbc: fbcCookie || null, // Use null if cookie value is not available
    	_fbp: fbpCookie || null, // Use null if cookie value is not available
        ...data,
      },
      {
        active: '<active>',
        session_id: Date.now().toString(),
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



