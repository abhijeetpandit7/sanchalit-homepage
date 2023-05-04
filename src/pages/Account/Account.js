import { memo, useEffect, useRef, useState } from "react";
import { LogoOverlay } from "../../components";
import {
  HIDE_APPS,
  TOKEN,
  checkIfExtensionIsInstalled,
  connectGoogle,
  getLocalCookieItem,
  getUser,
  getUserId,
  logInUserWithGoogle,
  mergeUserWithGoogle,
  removeRefClassName,
  setLocalCookieItem,
  signUpUserWithGoogle,
} from "../../utils";

const GOOGLE_SCRIPT_ID = "google-platform";

const ContextMemo = memo(({ mainViewRef, auth, isReady, token, setToken }) => {
  const isEmail = !!auth?.email;

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

  window.handleCredentialResponse = async (googleCredential) => {
    let response, authenticationType;
    let isExistingGoogleUser = false;
    const googleCredentialAssociatedAuthResponse = await getUserId(
      googleCredential
    );
    if (googleCredentialAssociatedAuthResponse?.success) {
      isExistingGoogleUser = true;
    }

    if (isExistingGoogleUser && token) {
      const isSeparateUserId =
        googleCredentialAssociatedAuthResponse.auth.userId !== auth.userId;
      if (isSeparateUserId) {
        response = await mergeUserWithGoogle(googleCredential, token);
        authenticationType = "mergeUserWithGoogle";
      }
    } else if (isExistingGoogleUser && !token) {
      response = await logInUserWithGoogle(googleCredential);
      authenticationType = "logInUserWithGoogle";
    } else if (!isExistingGoogleUser && token) {
      response = await connectGoogle(googleCredential, token);
      authenticationType = "connectGoogle";
    } else {
      response = await signUpUserWithGoogle(googleCredential);
      authenticationType = "signUpUserWithGoogle";
    }

    if (response?.success) {
      await setToken(response.auth.token);
      if (checkIfExtensionIsInstalled()) {
        window.postMessage(
          {
            type: authenticationType,
            payload: { auth: response.auth },
          },
          window.location
        );
      }
    }
  };

  const logOutUser = () => {
    setToken("");
    if (checkIfExtensionIsInstalled()) {
      window.postMessage({ type: "logOutUser" }, window.location);
    }
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
      <h1 className="mb-4 sm:mb-8 text-2xl font-bold text-center">
        {auth?.fullName}
      </h1>
      <img
        src={auth?.profilePictureUrl}
        alt="Profile"
        className="w-24 h-24 mb-4 sm:mb-8 object-cover rounded-full "
      />
      <button
        className="py-2 px-4 font-bold text-white rounded-lg bg-blue-500 hover:bg-blue-600"
        onClick={logOutUser}
      >
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
  const [auth, setAuth] = useState(null);
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
          const authResponse = await getUser(token);
          if (authResponse?.success) {
            await setAuth(authResponse.auth);
          }
        } else setAuth(null);
        setWidgetReady((prevState) => ({ ...prevState, api: true }));
      }
    })();
  }, [token, widgetReady.local]);

  useEffect(() => {
    (async () => {
      let token;
      try {
        token = await getLocalCookieItem(TOKEN);
      } catch (e) {}
      setToken(token);
      setWidgetReady((prevState) => ({ ...prevState, local: true }));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (token || token?.length === 0) {
        await setLocalCookieItem(TOKEN, token);
      }
    })();
  }, [token]);

  return <ContextMemo {...{ mainViewRef, auth, isReady, token, setToken }} />;
};

export default Account;
