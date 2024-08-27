
// background.js

const getApplyToJobFormFieldsWithLabels = async (auth, currentUrl, type) => {
    var inputs = [];
    const allowedTags = {
        ["select-one"]: 'label',
        radio: "div",
        text: "label",
        email: "label",
        checkbox : 'label',
        textarea : 'label',
        tel: 'label',
        file : 'label',
    }
    function getSelectOptions(element) {
      const options = [];
      for (const option of element.querySelectorAll("option")) {
        options.push({
          text: option.textContent,
          value: option.value,
          selected: option.selected,
        });
      }
      return options;
    }
  
    function isVisible(elem) {
      // Check if the element itself is explicitly hidden
      if (elem.offsetParent === null || getComputedStyle(elem).visibility === 'hidden' || getComputedStyle(elem).display === 'none') {
        return false;
      }
      // Recursively check parent elements' visibility
      let parent = elem.parentNode;
      while (parent && parent !== document.body) {
        if (getComputedStyle(parent).display === 'none' || getComputedStyle(parent).visibility === 'hidden') {
          return false; // The element is effectively invisible due to a hidden parent
        }
        parent = parent.parentNode;
      }
      return true; // The element and its parents are visible
    }
  
    function findAssociatedLabel(element, visited = new Set()) {
      function searchSiblingsAndParent(startElement, visited) {
        if (!startElement || visited.has(startElement) || startElement === document.body) return null;
        visited.add(startElement);
    
        let siblings = Array.from(startElement.parentNode ? startElement.parentNode.childNodes : []).filter(node => node.nodeType === Node.ELEMENT_NODE && !visited.has(node));
        for (let sibling of siblings) {
            
        const tagName = sibling.tagName.toLowerCase()

          if (tagName === allowedTags[element.type]) {
            
            if (isLabelValid(sibling.innerText.trim())) {
              return sibling.innerText.trim();
            }
          }
        }
        let parentLabel = searchSiblingsAndParent(startElement.parentNode, visited);
        if (parentLabel && isLabelValid(parentLabel)) return parentLabel;
        return null;
      }
      let foundLabel = searchSiblingsAndParent(element, new Set(visited));
      if (foundLabel && isLabelValid(foundLabel)) {
        const alreadyInclude = inputs.find(input => input.label === foundLabel);
        if (alreadyInclude) {
          return false;
        } else {
          return foundLabel;
        }
      }
  
      return false;
    }
  
  
    // Helper function to validate a label's text
    function isLabelValid(labelText) {
      // Define criteria for invalid labels
  
      const invalidCriteria = [
        "required field", // Example criterion
        // Add more criteria as needed
      ];
      const cleanLabel = labelText.toLowerCase().replace(/[\s:]*$/, ""); // Normalize and trim label text
  
      // Check against invalid criteria
      for (let criterion of invalidCriteria) {
        if (cleanLabel.includes(criterion)) {
          return false; // Label is not valid
        }
      }
  
      // Check for presence of HTML tags (simple check)
      if (/<\/?[a-z][\s\S]*>/i.test(cleanLabel)) {
        return false; // HTML detected, label is not valid
      }
      return true; // Label passed all checks
    }
  
    function getVisibleFormFields() {
      const allInputElements = document.querySelectorAll("input, select, textarea");
      allInputElements.forEach((element) => {
        
        if (isVisible(element) && ["text", "textarea", "select-one", "email","tel", "radio","checkbox","label","strong"].includes(element.type)) {
          const label = findAssociatedLabel(element);
          console.log("label", label);

        if ( element.type === 'checkbox') {
            let radioLabel  = element.value;
            //let sibling = element.nextElementSibling;
            // if (sibling.tagName.toLowerCase() === 'label' && element.type === 'radio') {
            //     radioLabel = sibling.innerHTML;
            // }
              //radioLabel = sibling.innerHTML;
              const name = element.name.split('-')[2];
              const labelCheckbox = document.getElementById('resumator-questionnaire-q' + element.name.split('-')[2] +'-label').innerText
            //   const startPart = labelCheckbox.split(/<\/?i[^>]*>/);
            //   const requiredstar = startPart[1];
            const checkRadio = inputs.find(data => data.name == name); //include  // element.name "resumator-checkbox-2008877-1"
            if (checkRadio && Array.isArray(checkRadio.checkboxes)) {
                checkRadio.checkboxes.push({ label: radioLabel , checked : element.checked,name : element.name,value: element.value});
            }
            else{
                const details = {
                    name: name,
                    type: element.type,
                    label: labelCheckbox || "",
                    checkboxes : [{label : radioLabel, checked : element.checked,name : element.name,value: element.value}]
                };
                console.log("details", details);
                inputs.push(details);
           }
          }
          else if(element.type === 'radio'){
            let radioLabel  = element.parentNode.innerText;   // element.value  //element.parentNode.innerText
            // let sibling = element.value;
            // if (sibling.tagName.toLowerCase() === 'label' && element.type === 'radio') {
            //     radioLabel = sibling.innerHTML;
            // }
            // //   radioLabel = sibling.innerHTML;
            const checkRadio = inputs.find(data => data.name === element.name);
            if (checkRadio && Array.isArray(checkRadio.checkboxes)) {
                checkRadio.checkboxes.push({ label: radioLabel , checked : element.checked,name : element.name,value: element.value});
            }
            else{
            const details = {
                name: element.name,
                type: element.type,
                label: label || "",
                checkboxes : [{label : radioLabel, checked : element.checked,name : element.name,value: element.value}]
            };
            inputs.push(details);
           }
          }
          else{
            const details = {
                id: element.id,
                name: element.name,
                // type: element.type || element.tagName.toLowerCase(), // handle select, textarea
                type: element.type === 'tel' ? 'text' : element.type || element.tagName.toLowerCase(), // handle select, textarea
                label: label ? label : "", 
              };
              if (element.tagName.toLowerCase() === "select") {
                if (label === false) {
                    details.label = element.parentElement.innerText.split('\n')[0]
                }    
                details.options = getSelectOptions(element);
              }
              if (element.tagName.toLowerCase() === "input") {
                
                if (label === false) {
                    details.label = element.parentElement.innerText
                }    
                details.options = getSelectOptions(element);
              }
            console.log("details", details);
              inputs.push(details);
          }
        } 

    });
          
      return inputs;
    }
    const formField = getVisibleFormFields();
    return formField;
  }



const getBambooHRFormFieldsWithLabels = async (auth, currentUrl, type) => {
    var inputs = [];
    const allowedTags = {
        ["select-one"]: 'label',
        radio: "legend",
        text: "label",
        email: "label",
        checkbox : 'label',
        textarea : 'label'
    }
    function getSelectOptions(element) {
      const options = [];
      for (const option of element.querySelectorAll("option")) {
        options.push({
          text: option.textContent,
          value: option.value,
          selected: option.selected,
        });
      }
      return options;
    }
  
    function isVisible(elem) {
      // Check if the element itself is explicitly hidden
      if (elem.offsetParent === null || getComputedStyle(elem).visibility === 'hidden' || getComputedStyle(elem).display === 'none') {
        return false;
      }
      // Recursively check parent elements' visibility
      let parent = elem.parentNode;
      while (parent && parent !== document.body) {
        if (getComputedStyle(parent).display === 'none' || getComputedStyle(parent).visibility === 'hidden') {
          return false; // The element is effectively invisible due to a hidden parent
        }
        parent = parent.parentNode;
      }
      return true; // The element and its parents are visible
    }
  
    function findAssociatedLabel(element, visited = new Set()) {

      function searchSiblingsAndParent(startElement, visited) {
        if (!startElement || visited.has(startElement) || startElement === document.body) return null;
        visited.add(startElement);
  
        let siblings = Array.from(startElement.parentNode ? startElement.parentNode.childNodes : []).filter(node => node.nodeType === Node.ELEMENT_NODE && !visited.has(node));
        for (let sibling of siblings) {
            
        const tagName = sibling.tagName.toLowerCase()

          if (tagName === allowedTags[element.type]) {
            if (isLabelValid(sibling.innerText.trim())) {
              return sibling.innerText.trim();
            }
          }
        }
        let parentLabel = searchSiblingsAndParent(startElement.parentNode, visited);
        if (parentLabel && isLabelValid(parentLabel)) return parentLabel;
  
        return null;
      }
      if (element.type === 'select-one') {
        const targetNode = element.parentNode.childNodes[0].childNodes[0];
        const menu_id = targetNode.getAttribute('data-menu-id')            
        const menu = document.getElementById(menu_id)
      }
      let foundLabel = searchSiblingsAndParent(element, new Set(visited));
      if (foundLabel && isLabelValid(foundLabel)) {
        const alreadyInclude = inputs.find(input => input.label === foundLabel);
        if (alreadyInclude) {
          return false;
        } else {
          return foundLabel;
        }
      }
  
      return false;
    }
  
  
    // Helper function to validate a label's text
    function isLabelValid(labelText) {
      // Define criteria for invalid labels
  
      const invalidCriteria = [
        "required field", // Example criterion
        // Add more criteria as needed
      ];
      const cleanLabel = labelText.toLowerCase().replace(/[\s:]*$/, ""); // Normalize and trim label text
  
      // Check against invalid criteria
      for (let criterion of invalidCriteria) {
        if (cleanLabel.includes(criterion)) {
          return false; // Label is not valid
        }
      }
  
      // Check for presence of HTML tags (simple check)
      if (/<\/?[a-z][\s\S]*>/i.test(cleanLabel)) {
        return false; // HTML detected, label is not valid
      }
      return true; // Label passed all checks
    }
  
    function getVisibleFormFields() {
      const allInputElements = document.querySelectorAll("input, select, textarea");
      allInputElements.forEach((element) => {
        if (isVisible(element) && ["text", "textarea", "select-one", "email", "radio","checkbox"].includes(element.type)) {
          const label = findAssociatedLabel(element);
        if (element.type === 'radio' || element.type === 'checkbox') {
            let radioLabel  = element.value;
            let sibling = element.nextElementSibling;
            if (sibling.tagName.toLowerCase() === 'label' && element.type === 'radio') {
                radioLabel = sibling.innerHTML;
            }
            //   radioLabel = sibling.innerHTML;
            const checkRadio = inputs.find(data => data.name === element.name);
            if (checkRadio && Array.isArray(checkRadio.checkboxes)) {
                checkRadio.checkboxes.push({ label: radioLabel , checked : element.checked,name : element.name,value: element.value});
            }
            else{
            const details = {
                name: element.name,
                type: element.type,
                label: label || "",
                checkboxes : [{label : radioLabel, checked : element.checked,name : element.name,value: element.value}]
            };
            inputs.push(details);
           }
          }else{
            const details = {
                id: element.id,
                name: element.name,
                type: element.type || element.tagName.toLowerCase(), // handle select, textarea
                label: label ? label : "", 
              };
              if (element.tagName.toLowerCase() === "select") {    
                details.options = getSelectOptions(element);
              }
              inputs.push(details);
          }
        } 
    });
          
      return inputs;
    }
    const formField = getVisibleFormFields();
    return formField;
  }

const getAllFormFieldsWithLabels = async (auth, currentUrl, type) => {
    if (currentUrl.includes("https://boards.greenhouse.io/")) {
        function getSelectOption(element) {
            const options = [];
            for (const option of element.options) {
                console.log(option.textContent, option.value);
                options.push({
                    text: option.textContent,
                    value: option.value,
                });
            }
            return options;
        }
        function getFormAndCheckboxInput() {
            const formElement = document.querySelector("form");
            const inputs = [];
            const fields = formElement.querySelectorAll('.field');
            fields.forEach((field,index) => {
                const labelElement = field.children[0].cloneNode(true);
                const span = labelElement.querySelector('span');
                // if (span) span.parentNode.removeChild(span);
                let labelText = labelElement.textContent.trim();

                const inputElements = Array.from(field.querySelectorAll("input:not([type=hidden]), textarea"));
                const selectElement = labelElement.querySelector('select');
                const laptopSpanId = labelElement.querySelector('.select2-container')?.children[0]?.querySelector('span');
                const inputElement = inputElements[0];
                if (inputElement && selectElement == null && inputElement.type !== "button" && inputElement.type !== "checkbox" && inputElement.type !== "radio" && labelText !== "") {
                    if(inputElement.id === 'resume_text'){
                        labelText = "Resume text";
                    } else if (inputElement.id === 'cover_letter_text') {
                        labelText = "Cover letter text"
                    }
                    inputs.push({
                        id: inputElement.id ? inputElement.id : inputElement.name,
                        name: inputElement.name,
                        label: labelText,
                        type: inputElement.type,
                        required: inputElement.required,
                        value: inputElement.value,
                    });
                 
                } else if (selectElement && labelText !== "") {
                    const options = getSelectOption(selectElement);
                    const input = {
                        laptopScreenId: laptopSpanId?.id != undefined ? laptopSpanId.id : "",
                        id: selectElement.id ? selectElement.id : selectElement.name,
                        name: selectElement.name,
                        label: labelText,
                        type: selectElement.type || "select",
                        required: selectElement.required,
                        options,
                        value: laptopSpanId?.innerHTML,
                    }
                 
                    inputs.push(input);
                    if (laptopSpanId) {
                        const observer = new MutationObserver((mutationsList, observer) => {
                            for (const mutation of mutationsList) {
                                if (mutation.type === 'childList') {
                                    chrome.runtime.sendMessage({
                                        action: "selectOptionChanged",
                                        data: {
                                            id: input.id,
                                            text: mutation.target.innerHTML
                                        }
                                    });
                                }
                            }
                        });
                        const config = { characterData: false, childList: true, attributes: false };
                        const opt = document.getElementById(laptopSpanId.id)
                        observer.observe(opt, config);
                    }

                } else if (field.classList.contains('demographic_question')) {
                    const options = field.querySelectorAll('label');
                    const checkboxes = [];
                    options.forEach((option) => {
                        const checkbox = option.querySelector('input')

                        checkboxes.push({
                            label: option.innerText,
                            name: { name: checkbox.name, value: checkbox.value },
                            checked: checkbox.checked,
                        })
                    })
                    inputs.push({
                        id: field.className,
                        name: field.className,
                        label: field.innerText,
                        type: "checkbox",
                        checkboxes: checkboxes,
                    });
                }
            });
            return inputs;
        }
        const InputFields = getFormAndCheckboxInput();

        if (InputFields.length > 0) {
            const form = document.querySelector('#application_form')
            var submitRapper = document.getElementById('submit_buttons');
            // Create a new button element
            if (!submitRapper.children[1]) {
                // Add an event listener to the cloned button
                submitRapper.children[0].addEventListener('click', function (event) {
                    let jobTitle = document.querySelector('.app-title')?.innerText;
                    let jobDescription = document.getElementById("content")?.innerText;
                    chrome.runtime.sendMessage({ action: "saveIFrameData", jobTitle, jobDescription})
                });
            }
            return InputFields

        } else {
            console.log("No matching fields found for labels.");
            return [];
        }
    }
    else if (currentUrl.includes("jobs.lever.co")) {

        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        if (mutation.target.style.cssText == "display: inline;") {
                        observer.disconnect()
                        chrome.runtime.sendMessage({
                            action: "refillJobForm",
                        })
                    }
                }
            }
        });
        const config = { characterData: false, childList: true, attributes: true };
        const [opt] = document.getElementsByClassName('resume-upload-success')
        observer.observe(opt, config);

        function getSelectOptions(element, shadowRoot) {
            const options = [];
            for (const option of element.querySelectorAll("option")) {
                options.push({
                    text: option.textContent,
                    value: option.value,
                    selected: option.selected,
                });
                // element.addEventListener('change', () => {
                //     console.log(element.name);
                //     const escapedName = element.name.replace(/(\[|\])/g, '\\$1');
                //     const shadowSelect = shadowRoot.querySelector(`#${escapedName}`)
                //     shadowSelect.value = element.value;
                // });
            }
            return options;
        }
        function getFormAndCheckboxInputs() {
            const formElement = document.querySelector("form");
            console.log("formElement", formElement);
            const inputs = [];
            const checkboxes = formElement.querySelectorAll('.application-question');

            checkboxes.forEach((question) => {
                const label = question.querySelector(".application-label");
                const labelText = label ? label.textContent.trim() : "";
                const inputElement = question.querySelector("input, select, textarea");
                if (inputElement && inputElement.type !== "hidden" && inputElement.type !== "button" && inputElement.type !== "checkbox" && inputElement.type !== "radio") {
                    const options = inputElement.tagName === "SELECT" ? getSelectOptions(inputElement) : null;
                    inputs.push({
                        id: inputElement.id ? inputElement.id : inputElement.name,
                        name: inputElement.name,
                        label: labelText,
                        type: inputElement.type || "select",
                        required: inputElement.required,
                        value: inputElement.value,
                        options,
                    });
                } else if (inputElement && inputElement.type === "checkbox") {
                    const checkboxList = question.querySelectorAll('ul[data-qa="checkboxes"] li');
                    const checkboxOptions = [];

                    checkboxList.forEach((checkboxItem) => {
                        const checkboxLabel = checkboxItem.querySelector('label');
                        const checkboxValue = checkboxLabel.querySelector('input').value;
                        const name = checkboxLabel.querySelector('input').name;
                        const checkbox = checkboxLabel.querySelector('input');

                        if (checkboxValue !== "") {
                            checkboxOptions.push({
                                label: checkboxValue,
                                name: name,
                                checked: checkboxItem.querySelector('input').checked,
                            });

                            checkbox.addEventListener('change', () => {
                                chrome.runtime.sendMessage({
                                    action: "checkboxChanged",
                                    data: {
                                        name: checkbox.name,
                                        value: checkbox.checked
                                    }
                                });
                            });
                        }
                    });

                    if (labelText !== "") {
                        inputs.push({
                            label: labelText,
                            checkboxes: checkboxOptions,
                            type: 'checkbox',
                        });
                    }
                } else if (inputElement && inputElement.type === "radio") {
                    const inputList = question.querySelectorAll('ul[data-qa="multiple-choice"] li');
                    const inputOptions = [];

                    inputList.forEach((inputItem) => {
                        const inputLabel = inputItem.querySelector('label');
                        const inputValue = inputLabel.querySelector('input').value;
                        const name = inputLabel.querySelector('input').name;

                        if (inputValue !== "") {
                            inputOptions.push({
                                label: inputValue,
                                name: name,
                                checked: false,
                            });
                        }
                        inputItem.addEventListener('click', () => {
                            const inputText = inputItem.innerText;
                            console.log(inputText);
                            const matchingElements = shadowRoot.querySelectorAll(`[name='${name}']`);
                            matchingElements.forEach(element => {
                                const nextLabel = element.nextElementSibling;
                                if (nextLabel && nextLabel.tagName === 'LABEL' && nextLabel.innerHTML === inputText) {
                                    element.checked = true;
                                }
                            });
                        });
                    });

                    if (labelText !== "") {
                        inputs.push({
                            label: labelText,
                            checkboxes: inputOptions,
                            type: "radio",
                        });
                    }
                }

            });
            return inputs;
        }

        const InputFields = getFormAndCheckboxInputs();

        console.log("Input fields: ", InputFields);
        if (InputFields.length > 0) {
            console.log(InputFields);
            // Create a new button element
            const form = document.querySelector('#application-form')
            // if (form) {
            //     form.addEventListener('submit', function (event) {
            //         const jobTitle = document.querySelector('.posting-header').innerText;
            //         const InputFields = [...getFormAndCheckboxInputs(), { jobTitle: jobTitle, jobDiscription: "" }];
            //         chrome.runtime.sendMessage({ action: "saveExtensionData", data: {
            //             auth, currentUrl, InputFields
            //         }})
            //     });
            // }

            if (form) {
                form.addEventListener('submit', function (event) {
                    event.preventDefault(); // Prevent the form from submitting immediately
                    const jobTitle = document.querySelector('.posting-header').innerText;
                    chrome.runtime.sendMessage({ action: "saveIFrameData", jobTitle, jobDescription: ""}, function(response) {
                        if (response && response.success) {
                            // Allow form submission if data is saved successfully
                            form.submit();
                        } else {
                            console.error("Failed to save data in background script", response);
                        }
                    });
                });
            }
            
            return InputFields
            // await fetchJobData(auth, currentUrl, InputFields, shadowRoot)
            // chrome.runtime.sendMessage({ action: "myProfile", data: { tabs, auth, isAutoFill, userData: userData, userEmail, shadowRoot } });

        } else {
            console.log("No matching fields found for labels.");
            return [];
        }
    } else {
        var inputs = [];
        function getSelectOptions(element) {
            const options = [];
            for (const option of element.querySelectorAll("option")) {
                options.push({
                    text: option.textContent,
                    value: option.value,
                    selected: option.selected,
                });
            }
            return options;
        }

        function isVisible(elem) {
            // Check if the element itself is explicitly hidden
            if (elem.offsetParent === null || getComputedStyle(elem).visibility === 'hidden' || getComputedStyle(elem).display === 'none') {
                return false;
            }
            // Recursively check parent elements' visibility
            let parent = elem.parentNode;
            while (parent && parent !== document.body) {
                if (getComputedStyle(parent).display === 'none' || getComputedStyle(parent).visibility === 'hidden') {
                    return false; // The element is effectively invisible due to a hidden parent
                }
                parent = parent.parentNode;
            }
            return true; // The element and its parents are visible
        }

        function findAssociatedLabel(element, visited = new Set()) {
            function searchSiblingsAndParent(startElement, visited) {
                if (!startElement || visited.has(startElement) || startElement === document.body) return null;
                visited.add(startElement);

                let siblings = Array.from(startElement.parentNode ? startElement.parentNode.childNodes : []).filter(node => node.nodeType === Node.ELEMENT_NODE && !visited.has(node));
                for (let sibling of siblings) {
                    if (['label', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'].includes(sibling.tagName.toLowerCase())) {
                        if (isLabelValid(sibling.innerText.trim())) {
                            return sibling.innerText.trim();
                        }
                    }
                }
                let parentLabel = searchSiblingsAndParent(startElement.parentNode, visited);
                if (parentLabel && isLabelValid(parentLabel)) return parentLabel;

                return null;
            }

            let foundLabel = searchSiblingsAndParent(element, new Set(visited));
            if (foundLabel && isLabelValid(foundLabel)) {
                const alreadyInclude = inputs.find(input => input.label === foundLabel);
                if (alreadyInclude) {
                    return false;
                } else {
                    return foundLabel;
                }
            }

            return false;
        }


        // Helper function to validate a label's text
        function isLabelValid(labelText) {
            // Define criteria for invalid labels

            const invalidCriteria = [
                "required field", // Example criterion
                // Add more criteria as needed
            ];
            const cleanLabel = labelText.toLowerCase().replace(/[\s:]*$/, ""); // Normalize and trim label text

            // Check against invalid criteria
            for (let criterion of invalidCriteria) {
                if (cleanLabel.includes(criterion)) {
                    return false; // Label is not valid
                }
            }

            // Check for presence of HTML tags (simple check)
            if (/<\/?[a-z][\s\S]*>/i.test(cleanLabel)) {
                return false; // HTML detected, label is not valid
            }
            return true; // Label passed all checks
        }

        function getVisibleFormFields() {
            const allInputElements = document.querySelectorAll("input, select, textarea");
            allInputElements.forEach((element) => {
                if (isVisible(element) && ["text", "textarea", "select-one", "select", "email"].includes(element.type)) {
                    const label = findAssociatedLabel(element);
                    const details = {
                        id: element.id,
                        name: element.name,
                        type: element.type || element.tagName.toLowerCase(), // handle select, textarea
                        label: label ? label : "",
                    };
                    if (element.tagName.toLowerCase() === "select") {
                        details.options = getSelectOptions(element);
                    }
                    inputs.push(details);
                }
            });

            return inputs;
        }
        const formField = getVisibleFormFields();
        return formField;
    }
    return
};

async function fetchAndSetFile(blob,currentPageUrl) {
    if (currentPageUrl.includes("applytojob.com")) {
        document.getElementById('resumator-choose-upload').click()
    }

    var fileInput = document.getElementById('resume-upload-input')
        || document.querySelector('input[type="file"][accept=".pdf"], input[type="file"][accept=".docx"]')
        || document.querySelector('input[type="file"]');

    if (blob && fileInput) {

        try {
            // PDF file URL

            // Create a File object with the blob
            var pdfFile = new File([blob], 'resume.pdf', { type: 'application/pdf' });

            // Create a custom FileList using DataTransfer
            let container = new DataTransfer();
            container.items.add(pdfFile);

            // Set the value of the file input field
            fileInput.files = container.files;

            // Create and dispatch a change event
            var event = new Event('change', { bubbles: true });

            fileInput.dispatchEvent(event);
        } catch (error) {
            console.error('Error fetching or setting the file:', error);
        }
    }
}
const fillJobForm = async (userData, currentUrl, isRefill) => {
    console.log("userData", userData);
    userData?.forEach((field, index) => {
        
        
        const inputElement = document.querySelector(
            `[name="${field.name}"]`
        );

        if (inputElement && (field.type == "email" || field.type == "text" || field.type == "textarea" || field.type == "input" || field.type == "select-one")) {
            if (field.value) {
                inputElement.value = field.value;
                let event = new Event('input', { bubbles: true });
                inputElement.dispatchEvent(event);
            }
            if (!isRefill) {

                inputElement.addEventListener('change', () => {
                    chrome.runtime.sendMessage({
                        action: "fieldChanged",
                        data: {
                            name: inputElement.name,
                            value: inputElement.value,
                            type: inputElement.type,
                            index
                        }
                    });
                });
            }
        } else if ((field.type == "checkbox" || field.type == "radio") && currentUrl.includes("jobs.lever.co")) {
            field.checkboxes?.forEach(obj => {
                const checkBoxInput = document.querySelectorAll(
                    `[name="${obj.name}"]`
                );
                checkBoxInput.forEach(element => {
                    if (element.value == obj.label) {
                        // my element is an input type checkbox mark checked it
                        element.checked = obj.checked;

                        // Add event listener for change

                        if (!isRefill) {
                            element.addEventListener('change', (event) => {
                                console.log('Checkbox state changed:', event.target.checked);
                                // Update the corresponding checkbox object in field.checkboxes
                                obj.checked = event.target.checked;
                                console.log('Updated field.checkboxes:', field.checkboxes);
                                if (event.target.checked) {
                                    chrome.runtime.sendMessage({
                                        action: "fieldChanged",
                                        data: {
                                            ...field,
                                            text: obj.label,
                                            index,
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            });
        }
        else if (field.type == "checkbox" && currentUrl.includes("greenhouse.io")) {
            const selected = field.checkboxes.filter(obj => obj.checked == true);
            selected?.forEach(obj => {
                const checkBoxInput = document.querySelectorAll(
                    `[name="${obj.name.name}"]`
                );
                checkBoxInput.forEach(element => {
                    if (element.value == obj.name.value) {
                        element.checked = true;
                    }
                });
            });
        } else if ((field.type == "radio" || field.type == "checkbox") && currentUrl.includes("bamboohr.com")) {
            const form = document.getElementById('careerApplicationForm')
            const radioInputs = form.querySelectorAll(
                `[name="${field.name}"]`
            );
            if (field.type == "radio") {
                const selected = field.checkboxes.find(obj => obj.checked == true);
                radioInputs.forEach(element => {
                    if (element.value == selected?.value && field.name == element.name) {
                        element.click();
                    }
                    
                    if (!isRefill) {
                        element.addEventListener('change', (event) => {
                            console.log('Checkbox state changed:', event.target.checked);
                            // Update the corresponding checkbox object in field.checkboxes
                            // selected.checked = event.target.checked;
                            // console.log('Updated field.checkboxes:', field.checkboxes);
                            if (event.target.checked || field.type == "checkbox") {
                                chrome.runtime.sendMessage({
                                    action: "fieldChanged",
                                    data: {
                                        ...field,
                                        text: event.target.value,
                                        index,
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                const [checkbox] = Array.from(radioInputs).filter(input => input.type == 'checkbox')
                if (checkbox) {
                    checkbox.click()
                    if (!isRefill) {
                        checkbox.addEventListener('change', (event) => {
                            console.log('Checkbox state changed:', event.target.checked);
                            // Update the corresponding checkbox object in field.checkboxes
                            // selected.checked = event.target.checked;
                            // console.log('Updated field.checkboxes:', field.checkboxes);
                            if (event.target.checked || field.type == "checkbox") {
                                chrome.runtime.sendMessage({
                                    action: "fieldChanged",
                                    data: {
                                        ...field,
                                        text: event.target.value,
                                        checkboxes: field.checkboxes.map(checkbox => ({...checkbox, checked: checkbox.value === event.target.value ? event.target.checked : checkbox.checked})),
                                        index,
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }
        else if ((field.type == "radio" || field.type == "checkbox") && currentUrl.includes("applytojob.com")) {
            const form = document.getElementById('form_submit_new_resume')
            if (field.type == "radio") {
                const radioInputs = form.querySelectorAll(
                    `[name="${field.name}"]`
                );
                const selected = field.checkboxes.find(obj => obj.checked == true);
                radioInputs.forEach(element => {
                    if (element.value == selected?.value && field.name == element.name) {
                        element.click();
                    }
                    
                    if (!isRefill) {
                        element.addEventListener('change', (event) => {
                            console.log('Checkbox state changed:', event.target.checked);
                            // Update the corresponding checkbox object in field.checkboxes
                            // selected.checked = event.target.checked;
                            // console.log('Updated field.checkboxes:', field.checkboxes);
                            if (event.target.checked || field.type == "checkbox") {
                                chrome.runtime.sendMessage({
                                    action: "fieldChanged",
                                    data: {
                                        ...field,
                                        text: event.target.value,
                                        index,
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                field.checkboxes.forEach(checkbox => {
                    const [checkboxInput] = form.querySelectorAll(
                        `[name="${checkbox.name}"]`
                    );
                    // const [checkbox] = Array.from(radioInputs).filter(input => input.type == 'checkbox')
                    if (checkboxInput) {
                        checkboxInput.checked = checkbox.checked
                        // checkbox.click()
                        if (!isRefill) {
                            checkboxInput.addEventListener('change', (event) => {
                                checkbox.checked = event.target.checked
                                console.log('Checkbox state changed:', event.target.checked);
                                // Update the corresponding checkbox object in field.checkboxes
                                // selected.checked = event.target.checked;
                                // console.log('Updated field.checkboxes:', field.checkboxes);
                                if (field.type == "checkbox") {
                                    chrome.runtime.sendMessage({
                                        action: "fieldChanged",
                                        data: {
                                            name :  checkboxInput.name,
                                            value: event.target.value,
                                            checkvalue : event.target.checked,
                                            type : field.type,

                                            // ...field,
                                            // checkboxes: field.checkboxes.map(checkbox => ({...checkbox, checked: checkbox.value === event.target.value ? event.target.checked : checkbox.checked})),
                                            index,
                                        }
                                    });
                                }
                            });
                        }
                    }
                })
            }
        }
        if (currentUrl.includes("greenhouse.io") && field.type == "select-one" && field.text != undefined) {
            const option = field.options.find(obj => obj.value == field.value);
            const text = option ? option.text : '';
            if (document.getElementById(field.laptopScreenId)) {
                document.getElementById(field.laptopScreenId).innerHTML = text;
            }
        }
        if (currentUrl.includes("greenhouse.io") && field.type == "textarea" && (field.id === 'cover_letter_text' || field.id === 'resume_text')) {
            const coverLetter = document.getElementById(field.id)
            coverLetter.style.display = 'block'
        }
    });
}

export const fillForm = async (tabId, userData, currentUrl, isRefill = false) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: fillJobForm,
            args: [userData, currentUrl, isRefill],
        }, (results) => {
            // Now the results array contains the result of the content script
            //   const result = results[0].result; // This will log the result of getAllFormFieldsWithLabels
            //   const data = fillJobForm(currentPageUrl, );
            //   callback(data)

            // Send the result back to the content script
            // port.postMessage({ success: true, result });
        });
    });

}
export const uploadFile = async (tabId, url,currentPageUrl) => {
    const fileResponse = await fetch('https://storage.googleapis.com/dms-login-test.appspot.com/resumes/tariqvacon%40test.com/temp_GANSBN5LMuhammad_Abdullah_Hanzalah.pdf');
    const blob = await fileResponse.blob()

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: fetchAndSetFile,
            args: [blob,currentPageUrl],
        }, (results) => {
            // Now the results array contains the result of the content script
            //   const result = results[0].result; // This will log the result of getAllFormFieldsWithLabels
            //   const data = fillJobForm(currentPageUrl, );
            //   callback(data)

            // Send the result back to the content script
            // port.postMessage({ success: true, result });
        });
    });

}



export const executeScript = async (tabId, auth, currentPageUrl, callback) => {
    let functionToExecute = getAllFormFieldsWithLabels
    if (currentPageUrl.includes("bamboohr.com")) {
        functionToExecute = getBambooHRFormFieldsWithLabels
    }
    if(currentPageUrl.includes("applytojob.com")){
        functionToExecute = getApplyToJobFormFieldsWithLabels
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabId },
                function: functionToExecute,
                args: [auth, currentPageUrl, "autoApply"],
            },
            (results) => {
                // Now the results array contains the result of the content script
                const result = results[0].result; // This will log the result of getAllFormFieldsWithLabels
                callback(result);
                // const data = fetchJobData(auth, currentPageUrl, result, "lever");
            }
        );
    });
};


// const btn =  document.querySelector('.fab-Select');
// const selectToggle = document.querySelector('.fab-SelectToggle');
// selectToggle.onclick = function () {
//     selectToggle.classList.add('fab-SelectToggle--bottom', 'fab-SelectToggle--focused', 'fab-SelectToggle--opened');
//     selectToggle.setAttribute('aria-expanded', 'true');
//     selectToggle.setAttribute('aria-controls', 'fab-menu1');

//     const gutsDiv = selectToggle.querySelector('.fab-SelectToggle__guts');
//     if (gutsDiv) {
//         gutsDiv.setAttribute('aria-expanded', 'true');
//     }
// }

    