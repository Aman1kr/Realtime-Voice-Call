import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;
let selectedFile;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  let   [imgResult,selectedFile] = useState('');
  const [imgResults, selectedFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    
    socket.on('imgResult' , imgResult =>{
      selectedFiles(imgResults => [...imgResults,imgResult]);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

   
 const  imgUpload = (event) => { 
    event.preventDefault();
    

    selectedFile =  event.target.files[0];
    let size = selectedFile.size;
    if(size <= 5990000 )
    {
      let reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onload = (e) => {
        imgResult = e.target.result;
        if(((imgResult.includes('image/png',5) || (imgResult.includes('image/jpeg',5)) || (imgResult.includes('image/gif',5)) || (imgResult.includes('image/jpg',5)) || (imgResult.includes('image/raw',5)) || 
        (imgResult.includes('image/raw',5)) ||
        (imgResult.includes('video/mp4',5))) && (imgResult.includes('base64',2))) == false)
        {
          imgResult = "File not supported only .mp4";
        }
        socket.emit('imgUpload', imgResult)
      }
    }
    else
    {
     socket.emit('imgUpload', "File too large");
    }
    event.target.value =null;
    };

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} imgUpload={imgUpload}  />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;