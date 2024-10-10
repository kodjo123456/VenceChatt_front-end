import React, { useState, useEffect, useRef } from "react";
import { UserStyle } from "../Users/style";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import "./Chat.css";
import axios from "axios";

export default function Chat2() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClipHovered, setIsClipHovered] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const chatRef = useRef(null);

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/all_users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  // Fonction pour récupérer les messages de l'utilisateur
  const fetchMessages = async (contactId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/messages/${contactId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedContact) {
      const newMessage = { text: message, type: "text", sender: "You" };
      setMessages((prev) => [...prev, newMessage]);

      // Envoi du message à l'API
      await axios.post(`http://localhost:8000/api/messages/${selectedContact.id}`, newMessage);
      setMessage("");

      // Simuler une réponse de l'interlocuteur
      setTimeout(() => {
        const reply = { text: "Reply from the other person", type: "text", sender: selectedContact.name };
        setMessages((prev) => [...prev, reply]);
      }, 1000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendFile = async () => {
    if (selectedFile && selectedContact) {
      const fileMessage = { file: selectedFile, type: "file", sender: "You" };
      setMessages((prev) => [...prev, fileMessage]);
      // Envoyer le fichier à l'API ici (ajoutez le code pour l'envoi de fichier)
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    fetchUsers(); // Récupérer les utilisateurs au chargement du composant
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id); // Récupérer les messages quand un contact est sélectionné
    }
  }, [selectedContact]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight; // Scroll automatique
    }
  }, [messages]);

  const renderMessageContent = (msg) => {
    if (msg.type === "text") {
      return msg.text;
    } else {
      const fileUrl = URL.createObjectURL(msg.file);
      const fileName = msg.file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
        return (
          <a href={fileUrl} download style={{ color: "blue", textDecoration: "underline" }}>
            <FaPaperclip /> {fileName}
          </a>
        );
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        return (
          <img
            src={fileUrl}
            alt={fileName}
            style={{ width: "200px", height: "100%" }} // Ajuste la taille de prévisualisation
          />
        );
      } else {
        return <span style={{ color: "red" }}>Unsupported file type</span>;
      }
    }
  };

  const isMessageEmpty = message.trim() === "";

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setMessages([]); // Réinitialiser les messages à chaque sélection de contact
  };

  return (
    <div style={UserStyle.Container} className="Poppins">
      <div className="center">
        <div className="contacts">
          <h2>Contacts</h2>
          <div className="contact_container">
            {users.map((contact) => (
              <div className="contact" key={contact.id} onClick={() => handleContactSelect(contact)}>
                <div className="pic" style={{ backgroundImage: `url(${contact.img})` }} />
                <div className="name">{contact.name}</div>
                <div className="badge">14</div> {/* Badge d'exemple */}
              </div>
            ))}
          </div>
        </div>

        <div className="chat">
          {selectedContact ? (
            <>
              <div className="bar">
                <div className="pic" style={{ backgroundImage: `url(${selectedContact.img})` }} />
                <div className="name">{selectedContact.name}</div>
                <div className="seen">Seen 2m ago</div>
              </div>

              <div id="chat" ref={chatRef}>
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type} ${msg.sender === "You" ? "sender" : "receiver"}`}>
                    {renderMessageContent(msg)}
                  </div>
                ))}
              </div>

              <div className="input">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />

                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={!isMessageEmpty ? handleSendMessage : null} // Bloque l'envoi si vide
                  style={{
                    cursor: isMessageEmpty ? "not-allowed" : "pointer",
                    color: isMessageEmpty ? "gray" : "blue",
                    transition: "transform 0.3s ease-in-out",
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  {isHovered ? <IoSend /> : <FaPaperPlane />}
                </div>

                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }} // Cacher le champ de fichier
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  onMouseEnter={() => setIsClipHovered(true)}
                  onMouseLeave={() => setIsClipHovered(false)}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    transition: "transform 0.3s ease-in-out",
                    transform: isClipHovered ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  <FaPaperclip />
                </label>

                <div
                  onClick={handleSendFile}
                  style={{ cursor: "pointer", color: selectedFile ? "blue" : "gray" }}
                >
                  <FaPaperPlane />
                </div>
              </div>
            </>
          ) : (
            <div className="no-contact-selected">Select a contact to chat
        
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
