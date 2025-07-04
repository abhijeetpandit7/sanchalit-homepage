import React, { memo, useEffect, useRef, useState } from "react";
import { LogoOverlay, Subscription, Upgrade } from "../../components";
import {
  HIDE_APPS,
  checkIfExtensionIsInstalled,
  connectGoogle,
  getUser,
  getUserId,
  isActiveSubscription,
  logInUserWithGoogle,
  logOut,
  mergeUserWithGoogle,
  removeRefClassName,
  signUpUserWithGoogle,
} from "../../utils";

const GOOGLE_SCRIPT_ID = "google-platform";

const ContextMemo = memo(({ mainViewRef, auth, setAuth }) => {
  const email = auth?.email;
  const userId = auth?.userId;
  const isActiveSubscriptionPlan = !!(
    auth?.subscriptionSummary?.plan &&
    isActiveSubscription(auth?.subscriptionSummary)
  );

  useEffect(() => {
    if (auth === null || !!email) return;
    const prevScript = document.getElementById(GOOGLE_SCRIPT_ID);
    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    if (prevScript) prevScript.replaceWith(script);
    else document.head.appendChild(script);
  }, [auth, email]);

  window.handleCredentialResponse = async (googleCredential) => {
    let response, authenticationType;
    let isExistingGoogleUser = false;
    const googleCredentialAssociatedAuthResponse = await getUserId(
      googleCredential
    );
    if (googleCredentialAssociatedAuthResponse?.success) {
      isExistingGoogleUser = true;
    }

    if (isExistingGoogleUser && userId) {
      const isSeparateUserId =
        googleCredentialAssociatedAuthResponse.auth.userId !== userId;
      if (isSeparateUserId) {
        response = await mergeUserWithGoogle(googleCredential);
        authenticationType = "mergeUserWithGoogle";
      }
    } else if (isExistingGoogleUser && !userId) {
      response = await logInUserWithGoogle(googleCredential);
      authenticationType = "logInUserWithGoogle";
    } else if (!isExistingGoogleUser && userId) {
      response = await connectGoogle(googleCredential);
      authenticationType = "connectGoogle";
    } else {
      response = await signUpUserWithGoogle(googleCredential);
      authenticationType = "signUpUserWithGoogle";
    }

    if (response?.success) {
      setAuth(response.auth);
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

  const logOutUser = async () => {
    const response = await logOut();
    if (response?.success) {
      setAuth({});
      if (checkIfExtensionIsInstalled()) {
        window.postMessage({ type: "logOutUser" }, window.location);
      }
    }
  };

  const SignInWithGoogle = () => (
    <div className="h-full flex flex-col justify-center background">
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
    </div>
  );

  const Profile = () => (
    <>
      <aside className="w-1/4 fixed sm:inset-0 float-left background"></aside>
      <div className="min-h-full sm:w-3/4 p-4 sm:p-8 flex flex-col sm:float-right bg-gray-100 text-neutral-600">
        <div className="box">
          <h1 className="mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold">
            Profile
          </h1>
          <img
            src={auth?.profilePictureUrl}
            alt="Profile"
            className="w-16 sm:w-20 h-16 sm:h-20 mb-4 sm:mb-8 object-cover rounded-full "
          />
          {[
            { label: "Full Name", value: auth?.fullName },
            { label: "Email", value: email },
          ].map(({ label, value }) => (
            <React.Fragment key={label}>
              <label className="text-lg sm:text-xl text-neutral-500">
                {label}
              </label>
              <input
                className="w-full mt-2 sm:mt-4 mb-4 sm:mb-8 p-2 text-lg sm:text-xl bg-gray-100 border-2 rounded-sm"
                defaultValue={value}
                disabled
              />
            </React.Fragment>
          ))}
          <button
            className="py-2 px-4 font-bold text-white rounded-lg bg-blue-400 rounded-3xl hover:bg-blue-300"
            onClick={logOutUser}
          >
            Log out
          </button>
        </div>
        {isActiveSubscriptionPlan ? (
          <Subscription />
        ) : (
          <Upgrade {...{ email, userId }} />
        )}
      </div>
    </>
  );

  return (
    <div className="relative h-full">
      <LogoOverlay />
      <div id="main-view" className={`${HIDE_APPS}`} ref={mainViewRef}>
        {email ? <Profile /> : <SignInWithGoogle />}
      </div>
    </div>
  );
});

const Account = () => {
  const mainViewRef = useRef(null);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    (async () => {
      const authResponse = await getUser();
      if (authResponse?.success) {
        setAuth(authResponse.auth);
      } else setAuth({});
      removeRefClassName(mainViewRef, HIDE_APPS);
    })();
  }, []);

  return <ContextMemo {...{ mainViewRef, auth, setAuth }} />;
};

export default Account;
