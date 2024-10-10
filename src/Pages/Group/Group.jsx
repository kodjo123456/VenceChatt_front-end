
import React, { useState, useEffect, useRef } from "react"; 
import axios from "axios"; 
import { IoSearch } from "react-icons/io5";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { format } from 'date-fns';
import "../ChatInterface/Chat.css"; // styles CSS propres

export default function GroupChat() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const chatRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const audioRef = useRef(new Audio('/audio/message-received.mp3'));
    const [lastMessageId, setLastMessageId] = useState(null); 

    // Formatage des dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Date invalide' : format(date, 'dd/MM/yyyy HH:mm');
    };

    // Récupération des groupes via API
    useEffect(() => {
        const fetchGroups = async () => {
            const userId = localStorage.getItem("UserId");
            try {
                const response = await axios.post('http://localhost:8000/api/SelectGroups', { member_id: userId });
                setGroups(response.data.groups);
            } catch (error) {
                console.error("Erreur lors de la récupération des groupes:", error);
            }
        };
        fetchGroups();
    }, []);

    // Gestion de la sélection de groupe et des messages
    const handleGroupSelect = async (group) => {
        setSelectedGroup(group);
        await fetchMessages(group.id);
    };

    // Récupération des messages
    const fetchMessages = async (groupId) => {
        try {
            const response = await axios.post('http://localhost:8000/api/getGroupMessages', { group_id: groupId });
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Erreur lors de la récupération des messages du groupe:", error);
        }
    };

    useEffect(() => {
        let intervalId;
        if (selectedGroup) {
            fetchMessages(selectedGroup.id);
            intervalId = setInterval(() => {
                fetchMessages(selectedGroup.id);
            }, 4000);
        }
        return () => clearInterval(intervalId);
    }, [selectedGroup]);

    // Envoi de message texte
    const handleSendMessage = async () => {
        if (!message.trim()) return;
        const newMessage = {
            group_id: selectedGroup.id,
            sender_id: localStorage.getItem("UserId"),
            message,
        };
        await axios.post('http://localhost:8000/api/SendMessageGroup', newMessage);
        setMessages([...messages, newMessage]);
        setMessage("");
        scrollToBottom();
    };

    // Envoi de fichier
    const handleSendFile = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("group_id", selectedGroup.id);
        formData.append("sender_id", localStorage.getItem("UserId"));
        formData.append("message", "Fichier partagé");
        formData.append("file", selectedFile);

        try {
            const response = await axios.post('http://localhost:8000/api/SendMessageGroup', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessages([...messages, response.data.data]);
            setSelectedFile(null);
            scrollToBottom();
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier:", error);
        }
    };

    // Scroll automatique vers le bas
    const scrollToBottom = () => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    };

    // Filtrage des groupes par recherche
    const filteredGroups = groups.filter(group => group.name.toLowerCase().includes(search.toLowerCase()));

    // Surveillance des nouveaux messages et notification sonore
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.id !== lastMessageId && lastMessage.sender_id !== localStorage.getItem("UserId")) {
                audioRef.current.play();
                setLastMessageId(lastMessage.id);
            }
        }
    }, [messages]);

    return (
        <div className="Poppins">
            <div className="center">
                {/* Section des groupes */}
                <div className="contacts">
                    <h2>Groupes</h2>
                    <div className="search-bar">
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Rechercher des groupes..."
                        />
                        <IoSearch />
                    </div>
                    <div className="contact_container">
                        {filteredGroups.map(group => (
                            <div 
                                key={group.id} 
                                className={`contact ${selectedGroup?.id === group.id ? 'active' : ''}`} 
                                onClick={() => handleGroupSelect(group)}
                            >
                                <div className="pic" style={{
                                    backgroundImage: `url(http://localhost:8000/uploads/${group.avatar})`,
                                    backgroundSize: 'cover',
                                    borderRadius: '50%',
                                }} />
                                <p>{group.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="action-links">
                        <a href="/chat">retour</a>
                        <a href="/createGroup">Créer</a>
                    </div>
                </div>
    
                {/* Section de chat */}
                <div className="chat">
                    {selectedGroup ? (
                        <>
                            <div className="bar">
                                <a href={`/GroupDetails/${selectedGroup.id}`}>
                                    <div className="group-pic" style={{ backgroundImage: `url(http://localhost:8000/uploads/${selectedGroup.avatar})` }} />
                                </a>
                                <div className="name">{selectedGroup.name}</div>
                                <a href={`/addMember/${selectedGroup.id}`}>
                                    <FaCirclePlus size={40} />
                                </a>
                            </div>
                            
                            <div id="chat" ref={chatRef}>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`message ${msg.sender_id !== localStorage.getItem("UserId") ? "" : "sender"}`}>
                                        {msg.file ? (
                                            <div className="file-message">
                                                {msg.file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                    <img src={`http://localhost:8000/uploads/sendGroupFile/${msg.file}`} alt="preview" />
                                                ) : (
                                                    <FaPaperclip size={30} />
                                                )}
                                                <a href={`http://localhost:8000/uploads/sendGroupFile/${msg.file}`} download>{msg.file}</a>
                                            </div>
                                        ) : (
                                            <p>{msg.message}</p>
                                        )}
                                        <span>{formatDate(msg.created_at)}</span>
                                    </div>
                                ))}
                            </div>
    
                            <div className="input">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tapez un message..."
                                />
                                <div onClick={handleSendMessage}><FaPaperPlane /></div>
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    id="file-input"
                                />
                                <label htmlFor="file-input"><FaPaperclip /></label>
                                <div
                                    onClick={handleSendFile}
                                    style={{ color: selectedFile ? "blue" : "gray" }}
                                >
                                    <FaPaperPlane />
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Sélectionnez un groupe pour démarrer une conversation</p>
                    )}
                </div>
            </div>
        </div>
    );
}
