import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  //form state
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const routeData = router.query;

  //submit post
  const submitPost = async (e) => {
    //run checks for desc
    if (!post.description) {
      toast.error("Polje ne moze ostati prazno", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
      });
      return;
    }
    if (post.description.length > 50) {
      toast.error("Max 50 karaktera", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
      });
      return;
    } else {
      setPost({ description: "" });
    }

    //edit a post
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "fullstackdb", post.id);
      const updatePost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatePost);
      return router.push("/");
    } else {
      //make a new post
      const collectionRef = collection(db, "fullstackdb");
      await addDoc(collectionRef, {
        ...post,
        timeStamp: serverTimestamp(),
        user: user.uid,
        username: user.displayName,
        avatar: user.photoURL,
      });
      toast.success("Vasa objava je postavljena", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      return router.push("/");
    }
  };

  //check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) router.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };
  useEffect(() => {
    if (!router.isReady) return;
    checkUser();
  }, [user, loading]);

  //enter to submit
  const keyDownHandle = (e) => {
    if (e.keyCode === 13) {
      checkUser();
      submitPost();
      // window.location.reload(false);
      setPost("");
    }
  };
  const length1 = post?.description?.length;

  return (
    <div className="w-full min-h-screen p-12 dark:bg-gray-500">
      <form
        onKeyDown={keyDownHandle}
        className="commentForm p-12 shadow-2xl rounded-lg max-w-md mx-auto dark:bg-gray-600"
      >
        <h1 className="text-2xl font-bold dark:text-white">
          {post.hasOwnProperty("id") ? "Edit your post" : "Create new post"}
        </h1>
        <div className="py-2">
          <h3 className="py-2 dark:text-white">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-700 h-48 w-full text-white rounded-lg my-4 p-2 text-sm"
          ></textarea>
          <p
            className={`text-cyan-500 font-medium text-sm ${
              length1 > 50 ? "text-red-600" : ""
            }`}
          >
            {length1}/50
          </p>
        </div>
        {/* <button
          type="submit"
          className="w-full bg-cyan-500 text-white p-2 ny-2 rounded-lg hover:bg-cyan-600"
        >
          Submit
        </button> */}
      </form>
    </div>
  );
}
