import "./App.css";
import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";

const socket = io.connect("http://localhost:3001");

function App() {

  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [usernameConfirmed, setUsernameConfimed] = useState(false)
  const [username, setUsername] = useState('')

  const chatMessagesRef = useRef(null);


  const sendMessage = () => {
    if (message) {
      socket.emit("send_message", {sender: username, message });
      setMessages((messages) =>[...messages, {username, message, isMine : true}])
      setMessage('')
    }

    
  }

  const confirmUsername = () => {

    if (username)
      setUsernameConfimed(true)

  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      

      setMessages((messages) => [...messages, {message : data.message, username : data.sender, isMine : false}])
    });
    return () => socket.off("receive_message");
  }, []);


  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="App">


      {
        usernameConfirmed ? 
        <></>
        :
        <div className="container">

          <div className="row center">
            <h3>Type your username</h3>
            <div className="col s4"></div>
            <input onKeyUp={(e) => e.key === 'Enter' && confirmUsername()} className="col s4" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            
          </div>
          <div className="center">
            <button className="btn" onClick={confirmUsername}>Confirm</button>
          </div>

        </div>
      }


      { usernameConfirmed ? 
      <>
        <div className="center"><h2>{username}</h2></div>
        <div id="chat-container">
          
          <ul id="chat-messages" ref={chatMessagesRef}>
            {messages.map((msg, index) => (
              msg.isMine ? 
              (<li key={index}>
                <div className="message-container">
                  <div className="user-message">{`You: ${msg.message}`}</div>
                </div>
              </li>)
              :
              (
                <li key={index}>
                  <div className="message-container">
                    <div className="friend-message">{`${msg.username}: ${msg.message}`}</div>
                  </div>
                </li>
              )
            ))}
          </ul>
          <input
            type="text"
            id="user-input"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
          />
        </div>
      </>
        :
        <></>
      }
      
      


    </div>
  );
}
export default App;