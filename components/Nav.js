import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useAuth } from "../utils/firebase";

export default function Nav() {
  //dark mode
  const [darkMode, setDarkMode] = useState("dark");
  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  const nighModeHandller = () => {
    setDarkMode(darkMode === "dark" ? "light" : "dark");
  };

  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between item-center bg-gray-200 py-10 px-6 dark:bg-gray-600">
      <Link href="/">
        <button className="bg-cyan-500 rounded-lg h-20 w-full mx-10 text-white text-2xl font-medium hover:bg-cyan-300 hover:text-black">
          Forum
        </button>
      </Link>
      <ul className="flex text-center">
        <div className="flex items-center gap-3 mx-12">
          <button
            onClick={nighModeHandller}
            className="bg-cyan-500 rounded-lg text-white py-3 px-4 hover:bg-cyan-600"
          >
            <BsFillMoonStarsFill className="h-6 w-auto" />
          </button>
          <Link href="/post">
            <button className="font-medium bg-cyan-500 rounded-lg text-white py-3 px-6 text-xl hover:bg-cyan-600">
              Post
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="font-medium bg-cyan-500 rounded-lg text-white py-3 px-4 text-xl hover:bg-cyan-600">
              My posts
            </button>
          </Link>
          {user && (
            <Link href="/profile">
              <img
                className="h-16 w-16 object-cover rounded-full ml-5 hover:h-20 hover:w-20 cursor-pointer"
                src={user?.photoURL}
              />
            </Link>
          )}
          {!user && <div></div>}
        </div>
      </ul>
    </nav>
  );
}
