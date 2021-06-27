import React, { useEffect, useState } from 'react';
import './style.css';
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import db from '../../firebase';

let collectionRef = null;

function SidebarChat({ type, name, id, photo }) {
  const history = useHistory();
  const [lastMessage, setLastMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  switch (type) {
    case 'room':
      collectionRef = db.collection('rooms');
      break;
    case 'chat':
      collectionRef = db.collection('chats');
      break;
    default:
      console.error("Missing 'type' prop in SidebarChat for " + name);
      break;
  }

  useEffect(() => {
    if (id) {
      collectionRef
        ?.doc(id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot =>
          setLastMessage(snapshot.docs[0]?.data().message)
        );
    }
  }, [id]);

  const handleClick = () => {
    history.push(`/${type}/${id}`, { name, photo });
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
    collectionRef?.doc(id).delete();
    collectionRef
      ?.doc(id)
      .collection('messages')
      .get().then(snapshot => {
        snapshot.forEach(doc => doc.ref.delete());
      });
    history.push('/');
  };

  return (
    <div className="SidebarChat" onClick={handleClick}>
      <Avatar src={photo} />
      <div className="sidebarChat__info">
        <h3>{name}</h3>
        <span>{lastMessage}</span>
      </div>
      <div className="sidebarChat__option">
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
