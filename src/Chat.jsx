import React, { useEffect, useState } from "react";
import firebase from "firebase";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
  Send,
} from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import db from "./firebase";

function Chat() {
  const [inputVal, setInputVal] = useState("");
  const [seed, setSeed] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const { roomId } = useParams();
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1000));
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      const unsubscribe = db
        .collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });

      const unsubscribeMess = db
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );

      return () => {
        unsubscribe();
        unsubscribeMess();
      };
    }
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputVal) return;

    db.collection("rooms").doc(roomId).collection("messages").add({
      email: user.email,
      name: user.displayName,
      message: inputVal,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInputVal("");
  };

  return (
    <div className='Chat'>
      <div className='chat__header'>
        <div className='chat__header-avatar'>
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        </div>
        <div className='chat__header-info'>
          <h3>{roomName}</h3>
          <span>
            Last seen&nbsp;
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toLocaleString()}
          </span>
        </div>
        <div className='chat__header-options'>
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className='chat__body'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat__message ${
              message.email === user.email
                ? "chat__message--reciever"
                : undefined
            }`}
          >
            <span className='chat__message-name'>{message.name}</span>
            {message.message}
            <span className='chat__message-timestamp'>
              {message.timestamp?.toDate().toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className='chat__footer'>
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <form onSubmit={sendMessage}>
          <input
            type='text'
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder='Type a message'
          />
          <IconButton type='submit'>
            <Send />
          </IconButton>
          <IconButton>
            <Mic />
          </IconButton>
        </form>
      </div>
    </div>
  );
}

export default Chat;
