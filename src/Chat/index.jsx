import React, { useEffect, useState } from "react";
import firebase from "firebase";
import "./style.css";
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
import { useStateValue } from "../StateProvider";
import db from "../firebase";
import Message from "./Message";

function Chat() {
  const [inputVal, setInputVal] = useState("");
  const [seed, setSeed] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const { roomId } = useParams();
  const [{ user }] = useStateValue();

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1000));
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      const unsubscribe = db
        .collection("rooms")
        .doc(roomId)
        .onSnapshot(snapshot => {
          setRoomName(snapshot.data()?.name);
        });

      const unsubscribeMess = db
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot(snapshot =>
          setMessages(snapshot.docs.map(doc => doc.data()))
        );

      return () => {
        unsubscribe();
        unsubscribeMess();
      };
    }
  }, [roomId]);

  useEffect(() => {
    const elem = document.querySelector(".chat__body");
    elem.scrollTop = elem.scrollHeight;
  }, [messages]);

  const sendMessage = e => {
    e.preventDefault();
    if (!inputVal) return;

    db.collection("rooms").doc(roomId).collection("messages").add({
      email: user.email,
      name: user.name,
      message: inputVal,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInputVal("");
    document.getElementById("message-input").focus();
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
        {messages.map(message => (
          <Message
            key={message.id}
            name={message.name}
            message={message.message}
            timestamp={message.timestamp?.toDate().toLocaleString()}
            isReciever={message.email === user.email}
          />
        ))}
      </div>
      <div className='chat__footer'>
        <IconButton className='chat__emoji-icon'>
          <InsertEmoticon />
        </IconButton>
        <form onSubmit={sendMessage}>
          <input
            type='text'
            id='message-input'
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder='Type a message'
            autoComplete='off'
          />
          <IconButton type='submit' disabled={!inputVal}>
            <Send />
          </IconButton>
          <IconButton className='chat__mic-icon'>
            <Mic />
          </IconButton>
        </form>
      </div>
    </div>
  );
}

export default Chat;
