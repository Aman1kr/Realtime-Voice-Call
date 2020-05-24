import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users }) => (
  <div className="textContainer">
    <div>
      <h1>Realtime Chat Application <span role="img" aria-label="emoji">💬</span></h1>
      <h2>Tribute to (Money Heist) La Casa De Papel<span role="img" aria-label="emoji">❤️</span></h2>
      <h2>Bella Ciao<span role="img" aria-label="emoji"> &#127929;&#127927;</span></h2>
      <h2 className="professor"> ~The Professor<img class="flags-icon" src="logo.png" /></h2>

    </div>
    {
      users
        ? (
          <div>
            <h1>People currently chatting:</h1>
            <div className="activeContainer">
              <h2>
                {users.map(({name}) => (
                  <div key={name} className="activeItem">
                    {name}
                    <img alt="Online Icon" src={onlineIcon}/>
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default TextContainer;