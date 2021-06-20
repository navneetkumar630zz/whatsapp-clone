import { memo } from "react";
import "./style.css";

function Message({ name, message, timestamp, isReciever }) {
  return (
    <div className={`message${isReciever ? " message--reciever" : ""}`}>
      <span className='message__name'>{name}</span>
      <div className='message__body'>
        <span className='message__text'>{message}</span>
        <span className='message__timestamp'>{timestamp}</span>
      </div>
    </div>
  );
}

export default memo(Message);
