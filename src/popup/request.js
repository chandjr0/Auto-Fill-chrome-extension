import { get, post, del, put } from "../utils/axios";

const endpoint = "user-premium-status";

export const checkPremium = (payload) => {
    return post(endpoint, payload);
}