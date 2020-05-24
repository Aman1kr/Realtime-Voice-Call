import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;
  let isImage = false;
  let isVideo = false;
  let isText = false;
  const trimmedName = name.trim().toLowerCase();

  if(text.includes('File not supported') || text.includes('File too large')){
    isText = true;
  }

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  if((text.includes('image/png',5) || (text.includes('image/jpeg',5)) || (text.includes('image/gif',5)) || (text.includes('image/jpg',5)) || (text.includes('image/raw',5))) && (text.includes('base64',2)))
  {
    isImage = true;
  }
  if((text.includes('video/mp4',5)) && (text.includes('base64',2)))
  {
    isVideo = true;
  }
  


  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            { isImage ? (
              <img className="messageText colorWhite" src={text} />
            )
            : isVideo ? (
              <video className="messageText colorWhite"  controls autoplay>
              <source src={text} />
                </video>
              )
              : (
                  <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
                )
              }
          </div>
        </div>
        )
        : (<div>
          { isText ? (
            console.log("Not supported "+isText)
          ) : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
            { isImage ? (
              <img className="messageText colorDark" src={text} />
            )
            : isVideo ? (
              <video className="messageText colorDark"  controls autoplay>
              <source src={text} />
                </video>
              )
              : (
              <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
            )}
            </div>
            <p className="sentText pl-10 ">{user}</p>
          </div>
          )
        }
        </div>
        )
  );
}

export default Message;