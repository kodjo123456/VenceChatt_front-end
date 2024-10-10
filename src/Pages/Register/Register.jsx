import React, { useState } from "react";
import "./Register.css";
import Input from "../../components/input/Input";
import { Link, useNavigate } from "react-router-dom";
import LoadingIndicator from "../../components/loading/LoadingIndicator";
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handle_register = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', confirmPassword);
    if (avatar) { // Ajoute uniquement si un fichier est sélectionné
      formData.append('avatar', avatar);
    }
    setLoading(true);  // Démarre l'indicateur de chargement

    try {
      const response = await axios.post('http://localhost:8000/api/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      if (error.response) {
          if (error.response.data.data) {
              Object.values(error.response.data.data).forEach((messages) => {
                  messages.forEach((message) => {
                      toast.error(message); // Affiche chaque message d'erreur
                  });
              });
          } else {
              toast.error(error.response.data.message); // Message générique
          }
          console.log(error.response.data); // Affiche les détails de l'erreur
      } else if (error.request) {
          toast.error('Erreur: Pas de réponse du serveur.');
      } else {
          toast.error(error.message);
      }
  }
  }

  return (
    <div className="container">
      <div className="drop">
        <div className="content">
          <form className="form" method="post" encType="multipart/form-data" onSubmit={handle_register}>
            <h2 className="animate_heartbeat">Inscription</h2>
            <p className="message">Inscrivez-vous pour commencer l'aventure.</p>

            <div className="input">
              <input
                placeholder="Nom"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Nom"
              />
            </div>

            <div className="input">
              <input
                placeholder="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
              />
            </div>

            <div className="input">
              <input
                placeholder="Mot de passe"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Mot de passe"
              />
            </div>

            <div className="input">
              <input
                placeholder="Confirmation du mot de passe"
                id="password-confirmation"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                required
                aria-label="Confirmation du mot de passe"
              />
            </div>

            <div className="input">
              <label htmlFor="avatar" className="avatar-label">
                Choisir un avatar
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                required
                style={{ width: "100%" }}
                onChange={(e) => setAvatar(e.target.files[0])}
                aria-label="Choisir un avatar"
              />
            </div>

            {loading && <LoadingIndicator />}

            <div className="input">
              <Input
                disabled={loading}
                type="submit"
                text={loading ? "Chargement ..." : "S'inscrire"}
              />
            </div>
          </form>
        </div>
      </div>
      <Link to="/login" className="btn signup">Connexion</Link>
    </div>
  );
}
