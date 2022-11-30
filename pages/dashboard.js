import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Message from "../components/message";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { async } from "@firebase/util";
import { deleteDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import Link from "next/link";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  //check users
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "fullstackdb");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };
  useEffect(() => {
    getData();
  }, [user, loading]);

  //delete post
  const deletePost = async (id) => {
    const docRef = doc(db, "fullstackdb", id);
    await deleteDoc(docRef);
  };

  return (
    <div className="rounded-lg  light:bg-white min-h-full dark:bg-gray-500">
      <h1 className="max-w-md mx-auto text-6xl font-bold py-5 text-center shadow-inner dark:text-white">
        My posts
      </h1>
      <div>
        {posts.map((post) => {
          return (
            <div key={post.id} className="light:bg-white dark:bg-gray-500">
              <Message {...post} key={post.id}>
                {" "}
              </Message>
              <div className="relative left-96 w-auto dark:bg-gray-500">
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-pink-600 flex items-center justify-center gap-2 py-2 text-xl px-5 dark:text-red-600"
                >
                  <BsTrash2Fill />
                  Delete
                </button>
                <Link href={{ pathname: "/post", query: post }}>
                  <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-xl px-5 dark:text-blue-800">
                    <AiFillEdit />
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => auth.signOut()}
        className="bg-cyan-500 rounded-lg h-14 w-32 text-white"
      >
        Sign out
      </button>
    </div>
  );
}

//<BsFillMoonStarsFill onClick={() => setDarkMode(!darkMode)}/>
