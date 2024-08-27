import axios from "axios";
import { setCookie, getCookie } from 'react-use-cookie';

function getAxios(tocInstance: boolean, header: any) {

  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: header
      ? header
      : {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Accept": "*/*",
      },
  });

  if (tocInstance) {
    const bearer = "adsasdadsaddassasdsa"
    if (bearer) {
      instance.defaults.headers.common.Authorization = bearer;
    } else {
      throw new Error("UnAuthorized");
    }
  }
  return instance;
}

function onAxiosRejected(error: any) {
  // handle exception failure.
  return error;
}

export const get = (uri: string, payload = null, tocInstance = true, req = false) =>
  getAxios(tocInstance, req)
    .get(uri, { params: payload })
    .then((res: any) => {
      return res.data;
    }, onAxiosRejected);

export const post = (uri: string, payload: any, tocInstance = true, req = false) =>
  getAxios(tocInstance, req)
    .post(uri, payload)
    .then((res: any) => {
      return res.data;
    }, onAxiosRejected);

export const postFd = (uri: string, payload: any, tocInstance = true) => {
  let header = {
    "Access-Control-Allow-Origin": "*",
    "content-type": "multipart/form-data",
  };
  return getAxios(tocInstance, header)
    .post(uri, payload)
    .then((res: any) => {
      return res.data;
    }, onAxiosRejected);
};

export const put = (uri: string, payload: any, tocInstance = true, req = false) =>
  getAxios(tocInstance, req)
    .put(uri, payload)
    .then((res: any) => {
      return res.data;
    }, onAxiosRejected);

export const del = (uri: string, tocInstance = true, req = false) =>
  getAxios(tocInstance, req)
    .delete(uri)
    .then((res: any) => {
      return res.data;
    }, onAxiosRejected);

export const delWithPayload = (uri: string, payload: any, tocInstance = true, req = false) =>
  getAxios(tocInstance, req)
    .delete(uri, { data: payload })
    .then((res: any) => {
      return res.data;
    }, onAxiosRejected);
