import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { useEffect } from "react";
import GoogleButton from "react-google-button";
import FacebookLogin from "react-facebook-login";

export default function Login() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);

  //sign in with google
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      route.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  //sign in with facebook
  const facebookProvider = new FacebookAuthProvider();
  const facebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.log(error);
    }
  };
  //if user logs in
  useEffect(() => {
    if (user) {
      route.push("/");
    } else {
      console.log("Unsuccessful login 🤢");
    }
  }, [user, loading]);

  return (
    <div className="dark:bg-gray-500">
      <h1 className="w-1/2 ml-[25%] text-center font-bold text-4xl text-gray-800 py-8 border-b-2 dark:bg-gray-500 dark:border-none dark:text-gray-100">
        Log in using
      </h1>
      <div className="text-center pt-2 dark:bg-gray-500">
        <div className="text-center shadow-xl mt-8 pb-10 text-gray-700 rounded-lg dark:text-white">
          <h2 className="text-3xl">Google</h2>
          <GoogleButton className="mx-auto mt-10 h-" onClick={googleLogin} />
        </div>
        <div className="text-center shadow-xl mt-32 pb-10 text-gray-700 rounded-lg dark:text-white">
          <h2 className="text-3xl pb-8">Facebook</h2>
          <FacebookLogin className="mx-auto mt-10" onClick={facebookLogin} />
        </div>
      </div>
    </div>
  );
}
