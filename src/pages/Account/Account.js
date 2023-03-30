import { memo, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { LogoOverlay } from "../../components";
import {
  googleLogo,
  AUTH,
  HIDE_APPS,
  URL_ROOT_API,
  isObjectEmpty,
  removeRefClassName,
} from "../../utils";

const ContextMemo = memo(({ mainViewRef, storageAuth }) => {
  const isEmail = !!storageAuth?.email;

  const SignInWithGoogle = () => (
    <div className="flex justify-center px-4 py-2">
      <a
        className="flex justify-center items-center py-2 px-4 border border-gray-300 bg-white rounded"
        href={`${URL_ROOT_API}/auth/google`}
      >
        <div className="google-button-logo">{googleLogo}</div>
        <span className="ml-2 text-stone-500">Sign in with Google</span>
      </a>
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

  useEffect(() => {
    (async () => {
      if (Object.values(widgetReady).every((value) => value === true)) {
        removeRefClassName(mainViewRef, HIDE_APPS);
      }
    })();
  }, [widgetReady]);

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

  return <ContextMemo {...{ mainViewRef, storageAuth }} />;
};

export default Account;
