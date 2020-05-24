import React, { Component } from 'react';
import io from 'socket.io-client';
import './Call.css';

import callIcon from '../../icons/call.png';
import callcutIcon from '../../icons/callcut.png';

let socket;
var abc=[];
var i=1;
var inc = "";
var count=1;
var property="";

const red = '#FF0000';
const green = '#00FF00';
class Call extends Component {

    
    constructor(props) {
        super(props)
        
        this.state = { color: red, visible: 'none' };
        this.changeColor = this.changeColor.bind(this);
        this.localAudioref = React.createRef()
        this.remoteAudioref = React.createRef()

        socket = null
        this.candidates = []
      }
      
      roomNameNew = () =>{
          console.log(this.props.room);
          abc[i]= this.props.room;
          console.log(abc[i]+" "+i);
        //this.abc = this.props.room;
            i=i+1;
      }
      
      //const abc = document.getElementById('abc').innerHTML;

      cont = (val) => {

        const ENDPOINT = 'http://localhost:5000';
        socket = io(ENDPOINT);

        socket.on('offerOrAnswer', (sdp) => {
            //this.abc =  this.props.data;
            console.log(sdp);
            // console.log(abc[1]);
           if((abc[1]) === sdp.user)
            {    
            this.textref.value = JSON.stringify(sdp)
            this.pc.setRemoteDescription(new RTCSessionDescription(sdp.sdp))
            }
            inc = this.textref.value; 
            console.log(inc);
            console.log(inc.includes("offer",16));
                if(inc.includes("offer",16))
                {
                    var ring = document.getElementById("ring");
                    ring.play();
                    const newC = this.state.visible == 'none' ? 'block' : 'none';
                    this.setState({  visible: newC })
                }

          })
      
        socket.on('candidate', (candidate) => {
            // console.log('From Peer... ', JSON.stringify(candidate))
            // this.candidates = [...this.candidates, candidate]
            
            this.pc.addIceCandidate(new RTCIceCandidate(candidate))
          })
            // const pc_config = null

        const pc_config = {
            
                'iceServers': [
                  {
                    'urls': 'stun:stun.l.google.com:19302'
                  },
                  {
                    'urls': 'turn:192.158.29.39:3478?transport=udp',
                    'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    'username': '28224511:1379330808'
                  },
                  {
                    'urls': 'turn:192.158.29.39:3478?transport=tcp',
                    'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    'username': '28224511:1379330808'
                  }
                ]
              
        }

        this.pc = new RTCPeerConnection(pc_config)
    
        this.pc.onicecandidate = (e) => {
            if (e.candidate) {
            this.sendToPeer('candidate', e.candidate)
            }
        }
    
        this.pc.oniceconnectionstatechange = (e) => {
            console.log(e)
        }
    
        this.pc.onaddstream = (e) => {
            this.remoteAudioref.current.srcObject = e.stream
        }
    
        const success = (stream) => {
            window.localStream = stream
            this.localAudioref.current.srcObject = stream
            this.pc.addStream(stream)
        }
    
        const failure = (e) => {
            console.log('getUserMedia Error: ', e);
        }
    
        const constraints = {
            audio: val
        }
        
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        navigator.mediaDevices.getUserMedia(constraints)
            .then(success)
            .catch(failure)
            
        }
    
    

    sendToPeer = (messageType, payload) => {
        // const user = getUser(socket.id);
        // console.log("user " +user+" d "+socket.id)
       
        socket.emit(messageType, {
          socketRN: this.props.room,
          payload
        })
      }
    
      /* ACTION METHODS FROM THE BUTTONS ON SCREEN */
    
      createOffer = () => {
        console.log('Offer')
        
        // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
        // initiates the creation of SDP
        this.pc.createOffer({ offerToReceiveAudio : 1 })
          .then(sdp => {
            // console.log(JSON.stringify(sdp))
    
            // set offer sdp as local description
            this.pc.setLocalDescription(sdp)
    
            this.sendToPeer('offerOrAnswer', sdp)
        })
      }
    

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
    // creates an SDP answer to an offer received from remote peer
    createAnswer = () => {
        console.log('Answer');

         var ring = document.getElementById("ring");
         ring.pause();
        this.pc.createAnswer({ offerToReceiveAudio: 1 })
        .then(sdp => {
            // console.log(JSON.stringify(sdp))

            // set answer sdp as local description
            this.pc.setLocalDescription(sdp)

            this.sendToPeer('offerOrAnswer', sdp)
        })
    }

    setRemoteDescription = () => {
        // retrieve and parse the SDP copied from the remote peer
        const desc = JSON.parse(this.textref.value)
        // set sdp as remote description
        this.pc.setRemoteDescription(new RTCSessionDescription(desc))
    }

    addCandidate = () => {
        // retrieve and parse the Candidate copied from the remote peer
        // const candidate = JSON.parse(this.textref.value)
        // console.log('Adding candidate:', candidate)

        // add the candidate to the peer connection
        // this.pc.addIceCandidate(new RTCIceCandidate(candidate))

        this.candidates.forEach(candidate => {
        console.log(JSON.stringify(candidate))
        this.pc.addIceCandidate(new RTCIceCandidate(candidate))
        });
    }

    contro = () => {
        window.location.href = '/'
    }

    changeColor(){
        this.cont(true);
        this.roomNameNew();
        const newColor = this.state.color == red ? green : green;
        this.setState({ color: newColor });

      }

    render(){
        const mystyle= {
            marginRight: 2,
            backgroundColor: "#fcfdfd00",
            borderColor: "#fcfdfd00",
            cursor: 'pointer',
            marginTop: 10,
            border:0,
            display: 'inline-block',
            paddingRight: 2,
            paddingLeft: 3  
        };

        return (
            <div>
            <div className="first" style={{display: (this.state.visible == 'none' ? 'block' : 'none') }}>    
                <button style={mystyle} onClick={() => {this.createOffer();}}><img src={callIcon} width="24px" height="30px" /></button>
                {/* <div className="activate" style={{display: 'inline-block'}}> */}
                    <button id="button5" style={{background: this.state.color,display: 'inline-block'}} onClick={this.changeColor}></button>
                    <p style={{display: 'inline-block'}}>Activate</p>
                    <button style={mystyle}  onClick={() => {this.contro();}}><img src={callcutIcon} width="20px" height="28px" /></button>
                {/* </div> */}
            </div>
            <div className="second" style={{display: this.state.visible}}>
                <button style={mystyle} onClick={this.createAnswer}><img src={callIcon} width="30px" height="30px" /></button>
                <p id="timmer" style={{display: 'inline-block'}}>Ringing</p>
                <button style={mystyle} onClick={() => {this.contro()}}><img src={callcutIcon} width="30px" height="30px" /></button>
            </div>
            {/* <button onClick={this.contro}>micout</button> */}


{/* 
            <button style={mystyle} onClick={() => {this.createOffer();}}><img src={callIcon} width="30px" height="30px" /></button> */}
            <div className="AudioControls">
            <textarea style={{ width: 100, height:30 }} ref={ref => { this.textref = ref }} />
                <audio controls muted ref={this.localAudioref} autoPlay></audio>
                <audio controls ref={this.remoteAudioref} autoPlay></audio>
                <audio id="ring" src="https://jk9nj200-a.akamaihd.net/downloads/ringtones/files/mp3/rockstar-14-4-38-6-32385.mp3"></audio>
            </div>
            </div>
        );
    }
}

export default Call;

