import { useRouter } from "next/router";
import { useState } from "react";
import { query } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function Message({
  children,
  avatar,
  username,
  description,
  comments,
}) {
  console.log(comments);
  return (
    <div className="text-black p-8 pb-12 mb-6 border-b-2 rounded-lg max-w-5xl mx-auto text-center text-clip break-normal dark:bg-gray-600 dark:text-white">
      <div className="flex items-center ">
        <img className="h-20 w-20 object-cover rounded-full" src={avatar} />
        <h2 className="text-3xl font-medium px-6">{username}</h2>
      </div>
      <div className="h-auto w-full p-3 dark:border-solid">
        <p className="break-words text-3xl font-medium w-120 py-8">
          {description}
        </p>
      </div>

      <div className="absolute left-[49%] w-6 text-2xl hover:font-bold hover:text-cyan-500">
        {children}
        {comments?.length}
      </div>
    </div>
  );
}
