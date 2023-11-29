const ACTIVE = "active";
const CANCELLED = "cancelled";
const EXPIRED = "expired";
export const HIDE_APPS = "hide-apps";
const PAST_DUE = "past_due";
const ON_TRIAL = "on_trial";
export const TOKEN = "token";
const UNPAID = "unpaid";

export const URL_CHECKOUT_DOMAIN = "https://sanchalit.lemonsqueezy.com";
export const URL_ROOT_API = "https://api.sanchalit.com";
export const URL_ROOT_DOMAIN = "https://sanchalit.com";

export const SUBSCRIPTION_STATUS_LIST = [
  { name: ACTIVE, key: ACTIVE, plus: true },
  { name: CANCELLED, key: CANCELLED, plus: true },
  { name: EXPIRED, key: EXPIRED, plus: false },
  { name: PAST_DUE, key: PAST_DUE, plus: true },
  { name: UNPAID, key: UNPAID, plus: false },
  { name: ON_TRIAL, key: ON_TRIAL, plus: true },
];
