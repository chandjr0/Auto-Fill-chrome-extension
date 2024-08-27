const formIdentifier = () => {
    const body = document.querySelector("body");
    if (body) {
        const fields = body.querySelectorAll('input, select, textarea');
        if (fields.length > 10) {
            return true
        }
        
    }
    return false
}

export const checkIsFormExist = () => {
    const isFormExist = new Promise((resolve, reject) => {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: formIdentifier,
            }, (isExist) => {
                if (isExist){
                    resolve(true)
                } else {
                    reject(false)
                }
            });
        });
    })
    return isFormExist
    }