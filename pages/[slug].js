import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import { async } from "@firebase/util";
import { arrayUnion, Timestamp, updateDoc } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  //submit a message
  const submitMessage = async () => {
    //check if user is logged
    if (!auth.currentUser) return router.push("/auth/login");
    //check if there is comment
    if (!message) {
      toast.error("Polje ne moze ostati prazno", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      return;
    }
    //gets posts, avatars etc. from db
    const docRef = doc(db, "fullstackdb", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
  };
  //get comments
  const getComments = async () => {
    const docRef = doc(db, "fullstackdb", routeData.id);
    const docSnap = await getDoc(docRef);
    setAllMessages(docSnap.data().comments);
  };

  //if enter is pressed it submits
  const keyDownHandle = (e) => {
    if (e.keyCode === 13) {
      submitMessage();
      getComments();
      // window.location.reload(false);
      setMessage("");
      toast.success("Vas komentar je postavljen !", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  };

  //loading comments
  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, []);
  return (
    <div className="py-2 dark:bg-gray-500 dark:text-white">
      <Message {...routeData} key={routeData.id}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={keyDownHandle}
            type="text"
            value={message}
            placeholder="Comment here 😊..."
            className="bg-gray-200 placeholder-black p-2 text-lg px-6 text-black h-14 w-full mx-96 justify-center dark:bg-gray-800 dark:placeholder-white dark:text-white"
          />
        </div>
        <div className="py-6 text-center h-screen">
          <h1 className="inline-flex ml-20 font-bold py-4 pt-12 w-80 text-3xl text-cyan-800 dark:text-cyan-400">
            Comment section
          </h1>
          {allMessages?.map((message) => (
            <div
              key={message.id}
              className="text-center text-xl pt-20 pb-36 font-medium border-2 hover:text-2xl"
            >
              <div>
                <img
                  className="w-20 rounded-full px-[40%]"
                  src={message.avatar}
                  alt=""
                />
                <h2 className="pb-6 text-3xl font-bold text-cyan-800 dark:text-cyan-400">
                  {message.userName}
                </h2>
              </div>
              <h3 className="text-2xl font-medium">{message.message}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
