import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';
import Call from '../Call/Call';
import './InfoBar.css';

const InfoBar = ({ room }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
      <h3>{room}</h3>
      <img class="flags-icon" src="logo.png" />
    </div>
    <div className="rightInnerContainer">
      <Call room = {room}/>
      <br />
      <a href="/"><img src={closeIcon} alt="close icon" /></a>
    </div>
  </div>
);

export default InfoBar;