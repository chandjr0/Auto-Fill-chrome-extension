export const makeRequest = async(
    loading,
    call,
    payload,
    onSuccess,
    onError
) => {
    loading(true);
    try {
         
        let res = await call(payload);
        if (res) {
            onSuccess(res, res);
        } else {
            if (onError) {

                onError(res, res);
            }
        }
    } catch (e) {
        if (onError) {
            onError(e.message, e);
        }
    }
    loading(false);
};