import axios from "axios";
import Cookies from "universal-cookie";
import moment from "moment";
import {
  URL_CHECKOUT_DOMAIN,
  URL_ROOT_API,
  URL_ROOT_DOMAIN,
  SUBSCRIPTION_STATUS_LIST,
} from "../utils";

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

export const formatDate = (timestamp, longMonthFormat = true) => {
  const date = new Date(timestamp);
  const options = {
    month: longMonthFormat ? "long" : "short",
    day: "numeric",
    year: "numeric",
  };
  return date
    .toLocaleDateString("en-US", options)
    .replace(/(\d)(st|nd|rd|th)/, "$1,");
};

export const generateCheckoutLink = (email, userId, plan) => {
  const queryParams = new URLSearchParams({
    "checkout[email]": email,
    "checkout[custom][userId]": userId,
    "checkout[custom][plan]": plan.id,
  });
  return `${URL_CHECKOUT_DOMAIN}/checkout/buy/${
    plan.variantId
  }?${queryParams.toString()}`;
};

const getDateFromToday = (numberOfDays) => {
  const date = new Date();
  date.setDate(date.getDate() + numberOfDays);
  return date;
};

export const getLocalCookieItem = (key) => new Cookies().get(key);

export const getNextRenewalDate = (renewsAt, interval) => {
  const renewalDate = moment.utc(renewsAt);
  let nextRenewalDate;
  if (interval === "year") {
    nextRenewalDate = renewalDate.clone().add(1, "year");
  } else if (interval === "month") {
    const daysInRenewalMonth = renewalDate.daysInMonth();
    nextRenewalDate = renewalDate.clone().add(daysInRenewalMonth, "days");
  }
  return nextRenewalDate;
};

export const getSubscriptionData = async (token) => {
  const headers = { Authorization: token };
  try {
    const response = await axios.get(`${URL_ROOT_API}/subscription`, {
      headers,
    });
    return response.data;
  } catch (error) {
    return;
  }
};

export const getSubscriptionPlans = async (token) => {
  try {
    const response = await axios.get(`${URL_ROOT_API}/subscriptionPlan`);
    return response.data;
  } catch (error) {
    return;
  }
};

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

export const isActiveSubscription = (subscriptionSummary) => {
  const { startDate, endDate } = subscriptionSummary;
  const instantDate = new Date();
  const isPlusAccessibleStatus = SUBSCRIPTION_STATUS_LIST.find(
    ({ name }) => name === subscriptionSummary.status
  )?.plus;
  const isDateWithinValidity =
    instantDate >= new Date(startDate) && instantDate <= new Date(endDate);
  return isPlusAccessibleStatus && isDateWithinValidity;
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

export const updateSubscriptionAutoRenewalStatus = async (
  token,
  subscriptionId,
  cancelled
) => {
  const headers = { Authorization: token };
  try {
    const response = await axios.post(
      `${URL_ROOT_API}/subscription/auto-renew`,
      { data: { subscriptionId, cancelled } },
      {
        headers,
      }
    );
    return response.data.currentSubscription;
  } catch (error) {
    return;
  }
};

export const removeRefClassName = (ref, className) =>
  ref.current
    ? ref.current.classList.remove(className)
    : ref.classList.remove(className);
