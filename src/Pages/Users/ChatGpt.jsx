
import React, { useState } from "react";
import { IoPaperPlane, IoMic } from "react-icons/io5";
import "./Chat.css"; // J'ai regroupé les styles CSS ici

export default function ChatInterface() {
  const [selectedUser, setSelectedUser] = useState({
    name: "Tony Stark",
    img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/7/73/SMH_Mentor_6.png",
  });

  const [messages, setMessages] = useState([
    { text: "Hey, are you coming to the meeting?", sender: "other" },
    { text: "Yeah, I'll be there in 5 minutes.", sender: "parker" },
    { text: "Alright, see you there!", sender: "other" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const contacts = [
    {
      name: "Steve Rogers",
      img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/7/7c/Cap.America_%28We_Don%27t_Trade_Lives_Vision%29.png",
    },
    {
      name: "Tony Stark",
      img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/7/73/SMH_Mentor_6.png",
    },
    {
      name: "Bruce Banner",
      img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/4/4f/BruceHulk-Endgame-TravelingCapInPast.jpg",
    },
    {
      name: "Thor Odinson",
      img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/9/98/ThorFliesThroughTheAnus.jpg",
    },
    {
      name: "Carol Danvers",
      img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/0/05/HeyPeterParker.png",
    },
  ];

  const handleContactClick = (contact) => {
    setSelectedUser(contact);
    setMessages([{ text: `You are now chatting with ${contact.name}.`, sender: "system" }]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: "parker" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="center">
      {/* Contacts Section */}
      <div className="contacts">
        <h2>Utilisateurs</h2>
        <div className="contact_container">
          {contacts.map((contact, index) => (
            <div className="contact" key={index} onClick={() => handleContactClick(contact)}>
              <div className="pic" style={{ backgroundImage: `url(${contact.img})` }}></div>
              <div className="name">{contact.name}</div>
              {contact.badge && <div className="badge">{contact.badge}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="chat">
        <div className="bar">
          <div className="pic" style={{ backgroundImage: `url(${selectedUser.img})` }}></div>
          <div className="name">{selectedUser.name}</div>
          <div className="seen">Seen 2m ago</div>
        </div>

        <div id="chat">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === "parker" ? "parker" : ""}`}>
              {message.text}
            </div>
          ))}
        </div>

        <div className="input">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <IoPaperPlane className="icon" onClick={handleSendMessage} />
          <IoMic className="icon" />
        </div>
      </div>
    </div>
  );
}

