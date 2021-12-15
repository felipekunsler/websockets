import React, { useEffect, useState } from 'react';
import './Messages.css';
import ReactLoading from 'react-loading';
import MessageInput from './MessageInput';

function Messages({ socket }) {
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const messageListener = (message) => {
      console.log(`message: ${JSON.stringify(message)}`)
      setMessages((prevMessages) => {
        const newMessages = {...prevMessages};
        newMessages[message.id] = message;
        return newMessages;
      });
    };

    const messageListenerBot = (message) => {
      console.log(`messageBOT: ${JSON.stringify(message)}`)
      setLoading(true);
      setTimeout(function() {
        setMessages((prevMessages) => {
          const newMessages = {...prevMessages};
          newMessages[message.id] = message;
          setLoading(false);
          return newMessages;
        });
      }, 1500);
      
    };
  
    const deleteMessageListener = (messageID) => {
      setMessages((prevMessages) => {
        const newMessages = {...prevMessages};
        delete newMessages[messageID];
        return newMessages;
      });
    };
  
    
    socket.on('message', messageListener);
    socket.on('messageBot', messageListenerBot);
    socket.on('deleteMessage', deleteMessageListener);
    socket.emit('getMessages');

    return () => {
      socket.off('message', messageListener);
      socket.off('messageBot', messageListenerBot);
      socket.off('deleteMessage', deleteMessageListener);
    };
  }, [socket]);

  return (
    <>
    <div className="message-list">
      
      {[...Object.values(messages)]
        .sort((a, b) => a.time - b.time)
        .map((message) => (
          
          <div
            key={message.id}
            className="message-container"
            //title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}
          >
            <span className="user">{message.user.name}:</span>
            <span className="message">{message.value}</span>
            <span className="date">{new Date(message.time).toLocaleTimeString()}</span>
          </div>
        ))
      }
      <div className="wait-list">
        {loading && (
        <ReactLoading type="bubbles" color="blue" height={10} width={35} />
        
        )}
        
      </div>

    </div>
    <MessageInput socket={socket} loading={loading} />
    </>
  );
}

export default Messages;