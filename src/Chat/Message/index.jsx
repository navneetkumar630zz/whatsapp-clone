import { memo } from 'react';
import { Checkbox } from '@material-ui/core';
import './style.css';

function Message({
  id,
  name,
  message,
  timestamp,
  isReciever,
  isSelectionOn,
  isSelected,
  setSelected,
}) {
  const handleSelect = () => {
    if (isSelected) setSelected(pre => pre.filter(e => e !== id));
    else setSelected(pre => [...pre, id]);
  };

  return (
    <div className={`message__wrapper${isReciever ? ' message--reciever' : ''}`}>
      {isSelectionOn && (
        <Checkbox
          color="primary"
          checked={isSelected}
          onChange={handleSelect}
        />
      )}
      <div className={`message${isSelected ? ' message--selected' : ''}`}>
        <span className="message__name">{name}</span>
        <div className="message__body">
          <span className="message__text">{message}</span>
          <span className="message__timestamp">{timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(Message);
