import React, { useEffect, useState } from 'react';
import './style.css';
import { Avatar, Button, IconButton, Tooltip } from '@material-ui/core';
import {
  Add,
  Chat,
  ExitToApp,
  MoreVert,
  SearchOutlined,
} from '@material-ui/icons';
import { useStateValue } from '../StateProvider';
import SidebarChat from './SidebarChat';
import db, { auth } from '../firebase';

function Sidebar() {
  const [{ user }] = useStateValue();
  const [rooms, setRooms] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribeRoom = db.collection('rooms').onSnapshot(snapshot => {
      setRooms(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    const unsubscribeChat = db
      .collection('users')
      .doc(user.id)
      .collection('chats')
      .onSnapshot(snapshot => {
        setChats(
          snapshot.docs.map(doc => ({
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
    const roomName = prompt('Please enter the room name');

    if (roomName) {
      db.collection('rooms').add({
        name: roomName,
      });
    }
  };

  const createChat = () => {
    // 1) Get the person's email
    const personEmail = prompt('Enter the email of the person');

    // 2) Basic validations
    if (!personEmail) return;
    if (personEmail === user.email) {
      alert("You can't chat with yourself");
      return;
    }
    if (chats.find(chat => chat.email === personEmail)) {
      alert('This person is already added in your chat');
      return;
    }

    // 3) Search the user in db
    db.collection('users')
      .where('email', '==', personEmail)
      .limit(1)
      .get()
      .then(result => {
        if (result.empty) {
          alert("User with this email id doesn's exist");
        } else {
          // 4) If exist then create chat
          const { email, name, photo } = result.docs[0].data();
          db.collection('chats')
            .add({
              persons: [user.id, result.docs[0].id],
            })
            .then(newDoc => {
              // 5) Add the chat into both users
              // 1st person
              db.collection('users').doc(user.id).collection('chats').add({
                chatid: newDoc.id,
                email,
                name,
                photo,
              });
              // 2nd person
              db.collection('users')
                .doc(result.docs[0].id)
                .collection('chats')
                .add({
                  chatid: newDoc.id,
                  email: user.email,
                  name: user.name,
                  photo: user.photo,
                });
            });
        }
      });
  };

  return (
    <div className="Sidebar">
      <div className="sidebar__header">
        <div className="sidebar__header-avtar">
          <Avatar src={user?.photo} />
        </div>
        <div className="sidebar__header-options">
          <Tooltip title="Logout">
            <IconButton onClick={() => auth.signOut()}>
              <ExitToApp />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create chat">
            <IconButton onClick={createChat}>
              <Chat />
            </IconButton>
          </Tooltip>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchbar-container">
          <SearchOutlined />
          <input type="text" placeholder="Search a chat" />
        </div>
      </div>
      <div className="sidebar__chats">
        <div className="sidebar__add-room">
          <Button startIcon={<Add />} onClick={createRoom}>
            Add Room
          </Button>
        </div>

        {rooms.map(room => (
          <SidebarChat
            key={room.id}
            id={room.id}
            type="room"
            name={room.name}
            photo={`https://avatars.dicebear.com/api/human/${Math.floor(
              Math.random() * 1000
            )}.svg`}
          />
        ))}
        {chats.map(chat => (
          <SidebarChat
            key={chat.chatid}
            id={chat.chatid}
            type="chat"
            name={chat.name}
            photo={chat.photo}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
