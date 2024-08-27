import { IAutoApply } from "iframe/interfaces/autoApply";
import { get, post, del, put } from "../../utils/axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const AUTO_APPLY = `${BASE_URL}/auto-apply`
const LONG_ANSWER = `${BASE_URL}/answer-for-longquestion`
const HELP_TEXT_FOR_LONG_QUESTION=  `${BASE_URL}/helptext-for-longquestion`



export const fetchAutoFillData = (payload: IAutoApply) => {
    return post(AUTO_APPLY, payload);
}


export const fetchLongAnswer = (payload: IAutoApply) => {
    return post(LONG_ANSWER, payload);
}

export const fetchHelpFullTextForLongQuestion = (payload: IAutoApply) => {
    return post(HELP_TEXT_FOR_LONG_QUESTION, payload);
}
