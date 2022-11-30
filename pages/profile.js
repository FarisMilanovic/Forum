import React, { useEffect, useState } from "react";
import { useAuth, upload } from "../utils/firebase";

export default function Profile() {
  const user = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper.png"
  );
  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  function handleClick() {
    upload(photo, user, setLoading);
  }

  useEffect(() => {
    setPhotoURL(user?.photoURL);
  }, [user]);
  return (
    <div className="w-full h-[58vh] py-20 px-20 shadow-lg dark:bg-gray-700">
      <input
        className="w-80 p-6 rounded-lg bg-cyan-500 indent-4 absolute left-1/4 hover:bg-cyan-600"
        type="file"
        onChange={handleChange}
      />
      <button
        disabled={loading || !photo}
        className="font-medium bg-cyan-500 rounded-lg text-white py-3 px-6 text-xl absolute left-1/4 top-[330px] hover:bg-cyan-600"
        onClick={handleClick}
      >
        Upload
      </button>
      <img
        className="p-10 w-96 absolute right-1/4 top-44 border-2 rounded-lg shadow-2xl"
        src={photoURL}
        alt="Avatar"
      />
    </div>
  );
}
