export const getAuthFromCookie = (): Promise<string> => {
    const auth = new Promise<string>((resolve, reject) => {
        if (chrome.cookies) {
            const cookieDetails = {
                url: "https://app.rampedcareers.com",
                name: "ramped-extension-login-token",
            };

            chrome.cookies.get(cookieDetails, (cookie) => {
                if (cookie) {
                    resolve(cookie.value)
                } else {
                    reject()
                }
            });
        }
    })
    return auth
}