import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import db from "./firebase";

function SidebarChat({ name, id }) {
  const [seed, setSeed] = useState("");
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1000));
  }, []);

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setLastMessage(snapshot.docs.map((doc) => doc.data().message)[0])
        );
    }
  }, [id]);

  return (
    <Link to={`/room/${id}`}>
      <div className='SidebarChat'>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className='sidebarChat__info'>
          <h3>{name}</h3>
          <span>{lastMessage}</span>
        </div>
      </div>
    </Link>
  );
}

export default SidebarChat;
