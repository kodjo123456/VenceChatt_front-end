import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip, FaPaperPlane, FaTrash } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import "./Users.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/40138-removebg-preview.png";
import toast from "react-hot-toast";

export default function Chat() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [email, setEmail] = useState("");
    const chatRef = useRef(null);
    const navigate = useNavigate();
    const { groupId } = useParams();

    // Définir l'ID de l'expéditeur (à adapter selon votre logique d'authentification)
    const senderId = 1; // Remplacez ceci par la logique pour obtenir l'ID de l'utilisateur connecté

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("handleSubmit");
        console.log({
            group_id: groupId,
            email: email,
            sender_id: senderId
        });

        try {
            const response = await axios.post("http://localhost:8000/api/group/1/add-member", {
                group_id: groupId,
                email: email,
                sender_id: senderId
            });
            toast.success("Utilisateur ajouté avec succès");
            navigate("/group");
        } catch (error) {
            console.error("Erreur lors de l'ajout du membre :", error);

            if (error.response) {
                console.log("Détails de l'erreur :", error.response.data);
                toast.error("Erreur: " + (error.response.data.message || "Une erreur est survenue"));
            } else {
                console.error("Erreur inconnue :", error);
                toast.error("Erreur inconnue, veuillez réessayer.");
            }
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/all_users");
            const data = response.data;
            setUsers(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const renderMessageContent = (msg) => {
        if (msg.type === "text") {
            return msg.text;
        } else if (msg.type === "image") {
            return <img src={msg.fileUrl} alt="sent" style={{ width: "200px", height: "auto" }} />;
        } else {
            const fileUrl = URL.createObjectURL(msg.file);
            const fileName = msg.file.name;
            const fileExtension = fileName.split(".").pop().toLowerCase();

            if (["pdf", "doc", "docx"].includes(fileExtension)) {
                return (
                    <a href={fileUrl} download style={{ color: "blue", textDecoration: "underline" }}>
                        {fileName}
                    </a>
                );
            } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
                return <img src={fileUrl} alt={fileName} style={{ width: "200px", height: "100%" }} />;
            } else {
                return <span style={{ color: "red" }}>Unsupported file type</span>;
            }
        }
    };

    const formatTime = (date) => {
        return `${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = { text: message, type: "text", sender: "You", time: new Date() };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessage("");
        }
    };

    const handleSendFile = () => {
        if (selectedFile) {
            const newFileMessage = { file: selectedFile, type: "file", sender: "You", time: new Date() };
            setMessages((prevMessages) => [...prevMessages, newFileMessage]);
            setSelectedFile(null);
        }
    };

    const handleDeleteMessage = (index) => {
        setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
    };

    return (
        <div style={styles.container} className="Poppins">
            <div style={styles.sectionBlack}>
                <h4>Tous les utilisateurs</h4>
                <div className="search-bar">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher des utilisateurs..."
                    />
                    <IoSearch />
                </div>
                <div style={styles.groupsList}>
                    {users.length === 1 ? (
                        <p style={{ color: "red", fontWeight: "bold" }}>Vous êtes seul pour l'instant !</p>
                    ) : users.length === 0 ? (
                        <p style={{ color: "red", fontWeight: "bold" }}>Aucun utilisateur trouvé !</p>
                    ) : (
                        users
                            .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
                            .map((user) => (
                                <div
                                    key={user.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div
                                        style={{
                                            ...styles.groupProfile,
                                            backgroundImage: `url(${user.avatar})`,
                                            backgroundSize: "cover",
                                        }}
                                    />
                                    <div>
                                        <p>{user.email}</p>
                                        <p style={{ fontWeight: "bold", color: "black" }}>{user.name}</p>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>

            <div style={styles.sectionBlue}>
            <h4>Ajouter un utilisateur</h4>
                <form action="" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder="Saisir l'email de l'utilisateur"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input type="submit" style={styles.button} value="Envoyer" />
                </form>
            </div>

            <div style={styles.sectionGrey}>
                <div style={styles.chatArea} ref={chatRef}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <p>{msg.sender}</p>
                                <p>{formatTime(new Date(msg.time))}</p>
                            </div>
                            <div>{renderMessageContent(msg)}</div>
                            <button onClick={() => handleDeleteMessage(index)} style={styles.button}>
                                <FaTrash /> Supprimer
                            </button>
                        </div>
                    ))}
                </div>

                <div style={styles.messageBar}>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder="Tapez votre message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={handleSendMessage} style={styles.button}>
                        <FaPaperPlane />
                    </button>
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    <button onClick={handleSendFile} style={styles.button}>
                        <FaPaperclip />
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        height: "100vh", // Utiliser toute la hauteur de la fenêtre
    },
    sectionBlack: {
        flex: 1,
        padding: "10px",
        backgroundColor: "black",
        color: "white",
        overflowY: "auto", // Permettre le défilement dans cette section
    },
    sectionBlue: {
        flex: 1,
        padding: "10px",
        backgroundColor: "blue",
        color: "white",
        overflowY: "auto", // Permettre le défilement dans cette section
    },
    sectionGrey: {
        flex: 2,
        padding: "10px",
        backgroundColor: "lightgrey",
        overflowY: "auto", // Permettre le défilement dans cette section
    },
    groupsList: {
        maxHeight: "300px", // Limite la hauteur pour le défilement
        overflowY: "auto",
    },
    groupItem: {
        cursor: "pointer",
        margin: "5px 0",
    },
    groupProfile: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        marginRight: "10px",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "5px 0",
    },
    button: {
        padding: "10px",
        backgroundColor: "black",
        color: "white",
        cursor: "pointer",
    },
    chatArea: {
        height: "calc(100vh - 150px)",
        overflowY: "auto", // Permettre le défilement dans cette zone de chat
    },
    messageBar: {
        display: "flex",
        alignItems: "center",
    },
};
