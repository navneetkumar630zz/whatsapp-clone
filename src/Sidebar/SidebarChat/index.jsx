import React, { useEffect, useState } from "react";
import "./style.css";
import { Avatar, IconButton, Menu, MenuItem } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import db from "../../firebase";
import { useStateValue } from "../../StateProvider";

let collectionRef = null;

function SidebarChat({ type, name, id, photo }) {
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [seed, setSeed] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  switch (type) {
    case "room":
      collectionRef = db.collection("rooms");
      break;
    case "chat":
      collectionRef = db.collection("users").doc(user.id).collection("chats");
      break;
    default:
      console.error("Missing 'type' prop in SidebarChat for " + name);
      break;
  }

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1000));
  }, []);

  useEffect(() => {
    if (id) {
      if (collectionRef) {
        collectionRef
          .doc(id)
          .collection("messages")
          .orderBy("timestamp", "desc")
          .onSnapshot(snapshot =>
            setLastMessage(snapshot.docs.map(doc => doc.data().message)[0])
          );
      }
    }
  }, [id]);

  const handleClick = () => {
    history.push(`/${type}/${id}`);
  };

  const openMenu = e => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = e => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleDelete = e => {
    e.stopPropagation();
    collectionRef.doc(id).set(null);
    history.push("/");
  };

  return (
    <div className='SidebarChat' onClick={handleClick}>
      <Avatar
        src={photo || `https://avatars.dicebear.com/api/human/${seed}.svg`}
      />
      <div className='sidebarChat__info'>
        <h3>{name}</h3>
        <span>{lastMessage}</span>
      </div>
      <div className='sidebarChat__option'>
        <IconButton onClick={openMenu}>
          <MoreVert />
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
          <MenuItem>Archive</MenuItem>
          <MenuItem>Open</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default SidebarChat;
