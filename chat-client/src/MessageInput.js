import React, { useState } from 'react';
import './MessageInput.css';

const NewMessage = ({socket, loading}) => {
  const [value, setValue] = useState('');
  
  const submitForm = (e) => {
    e.preventDefault();
    socket.emit('message', value);
    setValue('');
    
  };

  return (
    <>
    
    <form onSubmit={submitForm}>
      {loading ? (
      <input
        placeholder="Aguarde..."
        disabled
      />
      ): (
        <input
        autoFocus
        value={value}
        placeholder="Escreva sua mensagem"
        onChange={(e) => {
          setValue(e.currentTarget.value);
          
        }}
      />
      )}
    </form>
    </>
  );
};

export default NewMessage;