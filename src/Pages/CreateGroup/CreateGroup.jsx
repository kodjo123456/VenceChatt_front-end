import React, { useState } from 'react';
import './CreateGroup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [groupAvatar, setGroupAvatar] = useState(null);
  const navigate = useNavigate(); // Pour rediriger après la création du groupe

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (groupName === "") {
      toast.error("Veuillez renseigner le nom du groupe");
      return; // Empêche l'envoi si le nom du groupe est vide
    }
    if (groupName.length < 5) {
      toast.error("Le nom du groupe doit contenir au moins 5 caractères");
    
      return; // Empêche l'envoi si le nom du groupe est vide
    }


    const admin_id = localStorage.getItem("UserId");
    
    const formData = new FormData(); // Utiliser FormData pour envoyer des fichiers
    formData.append('name', groupName);
    formData.append('description', description);
    formData.append('avatar', groupAvatar); // Image de profil
    formData.append('admin_id', admin_id);

   const response = await axios.post('http://localhost:8000/api/CreateGroup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log(response.data); // Pour vérifier le résultat de la requête
    
    if (response.status === 201) {
      // toast.success("Success")
      // toast.success(response.data.message);
      navigate('/group');
    }
    else {
      toast.error(response.data.message);
    }
      
  };

  return (
    <div style={{backgroundColor:"#9787f5", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
      <form className="form_container" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Create a new group</h2>
        <p>Créez un groupe de discussion pour discuter avec vos amis</p>

        <input 
          type="text" 
          placeholder="Donnez un nom au groupe" 
          onChange={(e) => setGroupName(e.target.value)} 
          required 
        />

        <textarea 
          placeholder="Description (optionnel)" 
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label htmlFor="groupAvatar">Photo de profil</label>
        <input 
          type="file" 
          id="groupAvatar" 
          onChange={(e) => setGroupAvatar(e.target.files[0])} 
        />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
}
