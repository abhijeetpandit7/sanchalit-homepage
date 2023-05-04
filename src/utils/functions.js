import axios from "axios";
import Cookies from "universal-cookie";
import { URL_ROOT_API, URL_ROOT_DOMAIN } from "../utils";

export const checkIfExtensionIsInstalled = () => {
  const version = document.getElementById("sanchalitVersion");
  return version && version.value;
};

export const connectGoogle = async (googleCredential, token) => {
  let headers = {};
  if (token) {
    headers = {
      ...headers,
      Authorization: token,
    };
  }

  try {
    const response = await axios.post(
      `${URL_ROOT_API}/user/connect/google`,
      {
        googleCredential: googleCredential.credential,
      },
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    return;
  }
};

const getDateFromToday = (numberOfDays) => {
  const date = new Date();
  date.setDate(date.getDate() + numberOfDays);
  return date;
};

export const getLocalCookieItem = (key) => new Cookies().get(key);

export const getUser = async (token) => {
  const headers = { Authorization: token };
  try {
    const response = await axios.get(`${URL_ROOT_API}/user`, { headers });
    return response.data;
  } catch (error) {
    return;
  }
};

export const getUserId = async (googleCredential) => {
  const headers = {
    google_credential: googleCredential.credential,
  };
  try {
    const response = await axios.get(`${URL_ROOT_API}/user/id`, { headers });
    return response.data;
  } catch (error) {
    return;
  }
};

export const logInUserWithGoogle = async (googleCredential) => {
  try {
    const response = await axios.post(`${URL_ROOT_API}/user/login`, {
      googleCredential: googleCredential.credential,
    });
    return response.data;
  } catch (error) {
    return;
  }
};

export const mergeUserWithGoogle = async (googleCredential, token) => {
  const headers = { Authorization: token };
  try {
    const response = await axios.post(
      `${URL_ROOT_API}/userData/merge`,
      {
        googleCredential: googleCredential.credential,
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    return;
  }
};

export const setLocalCookieItem = (key, value) =>
  new Cookies().set(key, value, {
    domain:
      process.env.NODE_ENV === "production"
        ? `.${URL_ROOT_DOMAIN.split("https://")[1]}`
        : "",
    expires: getDateFromToday(365),
  });

export const signUpUserWithGoogle = async (googleCredential) => {
  try {
    const response = await axios.post(`${URL_ROOT_API}/user/signup/google`, {
      googleCredential: googleCredential.credential,
    });
    return response.data;
  } catch (error) {
    return;
  }
};

export const removeRefClassName = (ref, className) =>
  ref.current
    ? ref.current.classList.remove(className)
    : ref.classList.remove(className);
