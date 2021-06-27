import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import './style.css';
import { Avatar, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core';
import {
  CheckBoxOutlined,
  InsertEmoticon,
  Mic,
  MoreVert,
  Send,
} from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import db from '../firebase';
import Message from './Message';

let docRef;

function Chat() {
  const history = useHistory();
  const { type, id } = useParams();
  const [{ user }] = useStateValue();
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSelectionOn, setIsSelectionOn] = useState(false);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const { name, photo } = history.location.state;

  useEffect(() => {
    if (id) {
      // Make db reference
      switch (type) {
        case 'room':
          docRef = db.collection('rooms').doc(id).collection('messages');
          break;

        case 'chat':
          docRef = db.collection('chats').doc(id).collection('messages');
          break;

        default:
          console.error(
            "Invalid URL, type must be one of them: ['room', 'chat'] but get " +
              type
          );
          break;
      }
      // Get messages
      const unsubscribeMess = docRef
        ?.orderBy('timestamp', 'asc')
        .onSnapshot(snapshot =>
          setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        );

      // Some other activities
      setSelected([]);
      setIsSelectionOn(false);

      return () => {
        unsubscribeMess?.();
      };
    }
  }, [id]);

  useEffect(() => {
    const elem = document.querySelector('.chat__body');
    elem.scrollTop = elem.scrollHeight;
  }, [messages]);

  const sendMessage = e => {
    e.preventDefault();
    if (!inputVal) return;

    docRef.add({
      email: user.email,
      name: user.name,
      message: inputVal,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInputVal('');
    document.getElementById('message-input').focus();
  };

  const openMenu = e => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = e => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleMessDelete = () => {
    selected.forEach(id => {
      docRef.doc(id).delete();
    });
    setSelected([]);
    setIsSelectionOn(false);
  };

  return (
    <div className="Chat">
      <div className="chat__header">
        <div className="chat__header-avatar">
          <Avatar src={photo} />
        </div>
        <div className="chat__header-info">
          <h3>{name}</h3>
          <span>
            Last seen&nbsp;
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toLocaleString()}
          </span>
        </div>
        <div className="chat__header-options">
          <Tooltip title="Select">
            <IconButton color={isSelectionOn? 'primary': 'default'} onClick={() => setIsSelectionOn(pre => !pre)}>
              <CheckBoxOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton onClick={openMenu}>
              <MoreVert />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
            <MenuItem>Search</MenuItem>
            <MenuItem>Attach</MenuItem>
            <MenuItem disabled={!selected.length} onClick={handleMessDelete}>
              Delete
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className={`chat__body${type === 'chat' ? ' type-chat' : ''}`}>
        {messages.map(message => (
          <Message
            key={message.id}
            id={message.id}
            name={message.name}
            message={message.message}
            timestamp={message.timestamp?.toDate().toLocaleString()}
            isReciever={message.email === user.email}
            isSelectionOn={isSelectionOn}
            isSelected={selected.includes(message.id)}
            setSelected={setSelected}
          />
        ))}
      </div>
      <div className="chat__footer">
        <IconButton className="chat__emoji-icon">
          <InsertEmoticon />
        </IconButton>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            id="message-input"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Type a message"
            autoComplete="off"
          />
          <IconButton type="submit" color="secondary" disabled={!inputVal}>
            <Send />
          </IconButton>
          <IconButton className="chat__mic-icon">
            <Mic />
          </IconButton>
        </form>
      </div>
    </div>
  );
}

export default Chat;
