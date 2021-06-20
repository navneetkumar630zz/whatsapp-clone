import React, { useEffect, useState } from "react";
import "./style.css";
import { Avatar, Button, IconButton, Tooltip } from "@material-ui/core";
import {
  Add,
  Chat,
  ExitToApp,
  MoreVert,
  SearchOutlined,
} from "@material-ui/icons";
import { useStateValue } from "../StateProvider";
import SidebarChat from "./SidebarChat";
import db, { auth } from "../firebase";

function Sidebar() {
  const [{ user }] = useStateValue();
  const [rooms, setRooms] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribeRoom = db.collection("rooms").onSnapshot(snapshot => {
      setRooms(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    const unsubscribeChat = db
      .collection("users")
      .doc(user.id)
      .collection("chats")
      .onSnapshot(snapshot => {
        setChats(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });

    return () => {
      unsubscribeRoom();
      unsubscribeChat();
    };
  }, []);

  const createRoom = () => {
    const roomName = prompt("Please enter the room name");

    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
      });
    }
  };

  const createChat = () => {
    const personEmail = prompt("Enter the email of the person");

    if (personEmail) {
      db.collection("users")
        .doc()
        .get({ email: personEmail })
        .then(doc => {
          if (doc.exists) {
            db.collection("users").doc(user.id).collection("chats").add({
              id: doc.id,
              email: personEmail,
              name: doc.data().name,
              photo: doc.data().photo,
            });
          } else alert("User with this email id doesn's exist");
        });
    }
  };

  return (
    <div className='Sidebar'>
      <div className='sidebar__header'>
        <div className='sidebar__header-avtar'>
          <Avatar src={user?.photo} />
        </div>
        <div className='sidebar__header-options'>
          <Tooltip title='Logout'>
            <IconButton onClick={() => auth.signOut()}>
              <ExitToApp />
            </IconButton>
          </Tooltip>
          <Tooltip title='Create chat'>
            <IconButton onClick={createChat}>
              <Chat />
            </IconButton>
          </Tooltip>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className='sidebar__search'>
        <div className='sidebar__searchbar-container'>
          <SearchOutlined />
          <input type='text' placeholder='Search a chat' />
        </div>
      </div>
      <div className='sidebar__chats'>
        <div className='sidebar__add-room'>
          <Button startIcon={<Add />} onClick={createRoom}>
            Add Room
          </Button>
        </div>

        {rooms.map(room => (
          <SidebarChat
            key={room.id}
            id={room.id}
            type='room'
            name={room.name}
          />
        ))}
        {chats.map(chat => (
          <SidebarChat
            key={chat.id}
            id={chat.id}
            type='chat'
            name={chat.name}
            photo={chat.photo}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
