import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { Avatar, Button, IconButton } from "@material-ui/core";
import {
  Add,
  Chat,
  DonutLarge,
  MoreVert,
  SearchOutlined,
} from "@material-ui/icons";
import { useStateValue } from "./StateProvider";
import SidebarChat from "./SidebarChat";
import db from "./firebase";

function Sidebar() {
  const [{ user }, dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return () => {
      unsubscribe();
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

  return (
    <div className='Sidebar'>
      <div className='sidebar__header'>
        <div className='sidebar__header-avtar'>
          <Avatar src={user?.photoURL} />
        </div>
        <div className='sidebar__header-options'>
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
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

        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
