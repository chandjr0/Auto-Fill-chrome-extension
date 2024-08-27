let isDragging = false;
let startY;
const iframe = document.createElement('iframe');
const floatingWidget = document.createElement('div');

function initializeIFrame() {
    iframe.style.height = "100%";
    iframe.style.width = "450px";
    iframe.style.border = "0";
    iframe.style.backgroundColor = "#FFFFFF";
    iframe.style.position = "fixed";
    iframe.style.top = "0px";
    iframe.style.right = "-450px"; // Start off-screen
    iframe.style.zIndex = '1000';
    iframe.style.display = 'none';
    iframe.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    iframe.src = chrome.runtime.getURL("./iframe.html");
    iframe.setAttribute('allow', 'clipboard-write');
    document.body.appendChild(iframe);

    // Create the floating widget element
    // floatingWidget.style.position = 'fixed';
    // floatingWidget.style.top = '50%';
    // floatingWidget.style.right = '10px';
    // floatingWidget.style.width = '60px';
    // floatingWidget.style.height = '60px';
    // floatingWidget.style.backgroundColor = 'rgba(4, 4, 31, 0.80)';
    // floatingWidget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    // floatingWidget.style.zIndex = '1000';
    // floatingWidget.style.borderRadius = '5px 0px 0px 5px';
    // floatingWidget.style.overflow = 'hidden';
    // floatingWidget.style.cursor = 'pointer';
    // floatingWidget.style.padding = "24px"
    // floatingWidget.style.transition = 'width 0.3s ease'; // Smooth transition for width change


    // const image1 = document.createElement('img');
    // image1.src = chrome.runtime.getURL('extLogo.png');
    // image1.style.width = '40px';
    // image1.style.height = '23';

    // const image2 = document.createElement('img');
    // image2.src = chrome.runtime.getURL('extLogo.png'); // Assuming a second different image
    // image2.style.width = '0'; // Start with zero width
    // image2.style.height = '23px'; // Match the height of the first image
    // image2.style.transition = 'width 0.3s ease'; // Smooth transition for width change
    // image2.style.overflow = 'hidden'; // Prevent the image from displaying when width is zero



    // floatingWidget.style.display = 'flex';
    // floatingWidget.style.justifyContent = 'center';
    // floatingWidget.style.alignItems = 'center';
    // floatingWidget.style.flexDirection = 'row';
    // floatingWidget.style.padding = '8px';


    floatingWidget.style.position = 'fixed';
    floatingWidget.style.top = '50%';
    floatingWidget.style.right = '10px';
    floatingWidget.style.width = '60px';
    floatingWidget.style.height = '60px';
    floatingWidget.style.backgroundColor = 'rgba(4, 4, 31, 0.80)';
    floatingWidget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    floatingWidget.style.zIndex = '1000';
    floatingWidget.style.borderRadius = '5px 0px 0px 5px';
    floatingWidget.style.overflow = 'hidden';
    floatingWidget.style.cursor = 'pointer';
    floatingWidget.style.padding = "24px";
    floatingWidget.style.transition = 'width 0.3s ease'; // Smooth transition for width change


    const image1 = document.createElement('img');
    image1.src = chrome.runtime.getURL('extLogo.png');
    image1.style.width = '40px';
    image1.style.height = '23';
    image1.style.marginRight = "6px";


    const image2 = document.createElement('img');
    image2.src = chrome.runtime.getURL('sublogo.png'); // Assuming a second different image
    image2.style.width = '0'; // Start with zero width
    image2.style.height = '60px'; // Match the height of the first image
    image2.style.transition = 'width 0.3s ease'; // Smooth transition for width change
    image2.style.overflow = 'hidden'; // Prevent the image from displaying when width is zero



    floatingWidget.style.display = 'flex';
    floatingWidget.style.justifyContent = 'center';
    floatingWidget.style.alignItems = 'center';
    floatingWidget.style.flexDirection = 'row';
    floatingWidget.style.paddingTop = '8px';
    floatingWidget.style.paddingBottom = '8px';
    floatingWidget.style.paddingLeft = '8px';
    floatingWidget.style.paddingRight = '0px';

    floatingWidget.id = 'ramped-floating-widget';
    // Append the images to the floatingWidget
    floatingWidget.appendChild(image1);
    floatingWidget.appendChild(image2);

    // Append the floating widget to the document body
    document.body.appendChild(floatingWidget);

    console.log("Professional floating widget added to the page.");
    // }


    //functionality for draging the widget

    // Function to start dragging
    // const onMouseDown = (event) => {
    //     isDragging = true;
    //     startY = event.clientY - floatingWidget.offsetTop;
    //     floatingWidget.style.cursor = 'grabbing';

    //     const iframe = document.createElement('iframe');
    //     iframe.style.height = "100%";
    //     iframe.style.width = "450px";
    //     iframe.style.border = "0";
    //     iframe.style.backgroundColor = "#FFFFFF";
    //     iframe.style.position = "fixed";
    //     iframe.style.top = "0px";
    //     iframe.style.right = "-300px"; // Start off-screen
    //     iframe.style.zIndex = '1000';
    //     iframe.style.display = 'none';
    //     iframe.src = chrome.runtime.getURL("./iframe.html");

    //     document.body.appendChild(iframe);


    //     // Create the floating widget element
    //     const floatingWidget = document.createElement('div');

    //     // Set styles for the floating widget to make it appear on the right side of the screen
    //     floatingWidget.style.position = 'fixed';
    //     floatingWidget.style.top = '50%'; // Center vertically, adjust as needed
    //     floatingWidget.style.right = '10px'; // 10px from the right edge
    //     floatingWidget.style.width = '60px'; // Set the width of the widget
    //     floatingWidget.style.height = '60px'; // Set the height of the widget
    //     floatingWidget.style.backgroundColor = 'black'; // Use a white background or any color that fits your design
    //     floatingWidget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Add a shadow for a 3D effect
    //     floatingWidget.style.zIndex = '1000'; // Ensure it's on top of other content
    //     floatingWidget.style.borderRadius = '50px'; // Optional: round corners
    //     floatingWidget.style.overflow = 'hidden'; // Ensure the content fits within the widget
    //     floatingWidget.style.cursor = 'pointer'; // Change the cursor to a pointer

    //     const widgetText = document.createElement('div');
    //     widgetText.textContent = 'Ramped';
    //     widgetText.style.padding = '8px';
    //     widgetText.style.textAlign = 'center';
    //     widgetText.style.fontSize = '9px';
    //     widgetText.style.color = 'white ';
    //     widgetText.style.fontWeight = 'bold';
    //     widgetText.style.fontFamily = 'Arial, sans-serif';
    //     widgetText.style.textTransform = 'uppercase';
    //     widgetText.style.letterSpacing = '1px';
    //     widgetText.style.lineHeight = '1.5';
    //     widgetText.style.marginTop = "15px"
    //     floatingWidget.appendChild(widgetText);

    //     // Append the floating widget to the document body
    //     document.body.appendChild(floatingWidget);

    //     console.log("Professional floating widget added to the page.");


    //     //functionality for draging the widget
    //     let isDragging = false;
    //     let startY;

    //     // Function to start dragging
    const onMouseDown = (event) => {
        isDragging = true;
        startY = event.clientY - floatingWidget.offsetTop;
        floatingWidget.style.cursor = 'grabbing';
    };

    //     // Function to stop dragging
    const onMouseUp = () => {
        isDragging = false;
        floatingWidget.style.cursor = 'grab';
    };

    // Function to handle the dragging
    const onMouseMove = (event) => {
        if (isDragging) {
            const mousePositionY = event.clientY;
            floatingWidget.style.top = `${mousePositionY - startY}px`;
        }
    };

    //     // Add mouse event listeners to the floating widget
    floatingWidget.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    //     floatingWidget.addEventListener('mousedown', onMouseDown);

    //     // for hide and unhide 
    floatingWidget.addEventListener('click', () => {
        // Check if the iframe is visible and toggle its position
        if (iframe.style.right === '-450px') {
            slideInFrame()
        } else {
            slideOutFrame()
        }
    });

    floatingWidget.addEventListener('mouseenter', () => {
        floatingWidget.style.width = '85px'; // Expand width on hover
        image2.style.width = '25px'; // Show the second image by setting a non-zero width
        image2.style.marginRight = '-5px'; // Show the second image by setting a non-zero width


    });

    floatingWidget.addEventListener('mouseleave', () => {
        floatingWidget.style.width = '60px'; // Shrink width when not hovered
        image2.style.width = '0'; // Hide the second image by resetting width to zero
        image2.style.marginRight = '0px'; // Show the second image by setting a non-zero width

    });
}

const slideInFrame = () => {
    iframe.style.right = '0px'; // Slide in
    iframe.style.zIndex = '999999';
    iframe.style.display = 'block'
}

const slideOutFrame = () => {
    // iframe.style.right = '-450px'; // Slide out
    if (iframe.getAttribute('data-position') === 'left') {
        // If currently at left, move it to right
        iframe.style.right = '-450px';
        iframe.style.left = ''; // Clear the left property
        iframe.setAttribute('data-position', 'right'); // Update the position data
    } else {
        // If not at left, move it to left
        iframe.style.right = '0px'; // Clear the right property
        iframe.style.right = '-450px';
        iframe.setAttribute('data-position', 'right'); // Update the position data
    }
}

const autoApply = () => {
    slideInFrame();
    setTimeout(iframe.contentWindow.postMessage("autoFillMessage", "*"), 1000);


}

const slideMoveFrame = () => {
    // Check the current state of the iframe and toggle accordingly
    if (iframe.getAttribute('data-position') === 'left') {
        // If currently at left, move it to right
        iframe.style.right = '0px';
        iframe.style.left = ''; // Clear the left property
        iframe.setAttribute('data-position', 'right'); // Update the position data
    } else {
        // If not at left, move it to left
        iframe.style.left = '0px';
        iframe.style.right = ''; // Clear the right property
        iframe.setAttribute('data-position', 'left'); // Update the position data
    }
}



// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
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
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const fields = document.querySelectorAll('input, select, textarea');
            const visibleFields = Array.from(fields).filter(field => isVisible(field) && !(field.type === 'hidden'))
            if (visibleFields.length > 20) {
                initializeIFrame()
                observer.disconnect(); // Stop observing
                break;
            }
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations





const checkPremium = async (auth, webUrl) => {

    var url = `https://ramped-api-nocors-staging-dot-extended-spark-381423.uc.r.appspot.com/user-premium-status`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ auth: auth || '', token: "adsasdadsaddassasdsa" }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData = await response.json();

        if (!responseData) {
            console.error('responseData is null');
            return;
        }

        console.log('responseData this:', responseData);
        // chrome.storage.local.set({ 'userPremiumStatus': responseData });

        const userEmail = responseData.user_email || '';

        if (responseData?.response == "Not Premium") {
            // Navigate to plans
        } else {
            if (!responseData.resume_uploaded_status) {
                // Navigate to upload resume
            } else {
                const fields = document.querySelectorAll("input, select, textarea");
                const visibleFields = Array.from(fields).filter(field => !(field.type === 'hidden'))
                if (webUrl?.includes("jobs.lever.co") || webUrl?.includes("boards.greenhouse.io") || webUrl?.includes("bamboohr.com") || webUrl?.includes("applytojob.com")) {
                    initializeIFrame();
                } else {
                    observer.observe(document.body, config);
                }
                return {
                    status: true,
                    userData: responseData.resume_data || {},
                    userEmail: userEmail,
                };
            }
        }

    } catch (error) {
        console.error("Fetch failed:", error);
    } finally {
        // toggleSpinnerLoader(false);
    }
}

chrome.runtime.sendMessage({ action: "getCookie" }, async function (response) {
    const url = new URL(response.activeTab.url);
    const user = await checkPremium(response.data, response?.activeTab?.url);
    const params = new URLSearchParams(url.search);
    const paramsRamped = params.get('ramped')
    if (paramsRamped === 'true') {
        if (!floatingWidget) {

            initializeIFrame();
        }
        setTimeout(autoApply, 1000);
    }

});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "closeIFrame") {
            slideOutFrame()
            // slideMoveFrame()
        }
        if (request.action === "moveFrame") {
            slideMoveFrame()
        }
        if (request.action === "openIframe") {
            if (request.action === "openIframe") {
                const floatingWidget = document.getElementById('ramped-floating-widget');
                const pageIframes = document.querySelectorAll('iframe') || [];
                const greenhouseIframe = [...pageIframes].find(frame => frame.src.includes("https://boards.greenhouse.io"))
                if (greenhouseIframe) {
                    const src = greenhouseIframe.src + "&ramped=true";
                    chrome.runtime.sendMessage({ action: "openNewTab", url: src });
                } else {
                    if (!floatingWidget) {

                        initializeIFrame();
                    }

                    setTimeout(autoApply, 1000);
                    sendResponse({ action: "popupClosed" });
                }
            }


        }
    }
)