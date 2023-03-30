import { memo, useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { LogoOverlay } from "../../components";
import {
  AUTH,
  HIDE_APPS,
  URL_ROOT_API,
  isObjectEmpty,
  removeRefClassName,
} from "../../utils";

const GOOGLE_SCRIPT_ID = "google-platform";

const ContextMemo = memo(({ mainViewRef, isReady, storageAuth }) => {
  const isEmail = !!storageAuth?.email;

  useEffect(() => {
    if (isReady === false) return;
    if (isEmail) return;
    if (!document.getElementById(GOOGLE_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [isReady, isEmail]);

  window.handleCredentialResponse = (googleCredential) => {
    let headers = {};
    if (storageAuth?.token)
      headers = {
        ...headers,
        Authorization: "Bearer " + storageAuth.token,
      };

    axios
      .post(
        `${URL_ROOT_API}/user/register`,
        {
          googleCredential: googleCredential.credential,
        },
        {
          headers,
        }
      )
      .then((res) => {
      });
  };

  const SignInWithGoogle = () => (
    <div className="flex justify-center px-4 py-2">
      <div
        id="g_id_onload"
        data-client_id="83080450952-rllpgdh47oov5kjdgm817j0n1n7qsh18.apps.googleusercontent.com"
        data-context="signup"
        data-ux_mode="popup"
        data-callback="handleCredentialResponse"
        data-auto_prompt="false"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </div>
  );

  const Profile = () => (
    <div className="p-4 sm:p-8 flex flex-col items-center">
      <h1 className="mb-4 sm:mb-8 text-2xl font-bold text-center">John Doe</h1>
      <img
        // src="/profile.png"
        alt="Profile"
        className="w-24 h-24 mb-4 sm:mb-8 object-cover rounded-full "
      />
      <button className="py-2 px-4 font-bold text-white rounded-lg bg-blue-500 hover:bg-blue-600">
        Log out
      </button>
    </div>
  );

  return (
    <div className="relative h-full">
      <LogoOverlay />
      <div
        id="main-view"
        className={`h-full flex flex-col justify-center bg-cover bg-center ${HIDE_APPS}`}
        ref={mainViewRef}
      >
        {isEmail ? <Profile /> : <SignInWithGoogle />}
      </div>
    </div>
  );
});

const Account = () => {
  const mainViewRef = useRef(null);
  const [storageAuth, setStorageAuth] = useState(null);
  const [token, setToken] = useState(null);
  const [widgetReady, setWidgetReady] = useState({
    local: false,
    api: false,
  });
  const isReady = Object.values(widgetReady).every((value) => value === true);

  useEffect(() => {
    (async () => {
      if (isReady) {
        removeRefClassName(mainViewRef, HIDE_APPS);
      }
    })();
  }, [isReady]);

  useEffect(() => {
    (async () => {
      if (widgetReady.local) {
        if (token) {
        }
        setWidgetReady((prevState) => ({ ...prevState, api: true }));
      }
    })();
  }, [token, widgetReady.local]);

  useEffect(() => {
    (async () => {
      let auth;
      try {
        auth = await JSON.parse(Cookies.get(AUTH));
      } catch (e) {}
      setStorageAuth(auth ?? {});
      setToken(auth?.token);
      setWidgetReady((prevState) => ({ ...prevState, local: true }));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (isObjectEmpty(storageAuth) === false) {
        await Cookies.set(AUTH, JSON.stringify(storageAuth), { expires: 365 });
      }
    })();
  }, [storageAuth]);

  return <ContextMemo {...{ mainViewRef, isReady, storageAuth }} />;
};

export default Account;
