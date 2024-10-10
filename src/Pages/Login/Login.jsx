import React, { useState } from 'react'
import Button from '../../Components/Button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingIndicator from "../../components/loading/LoadingIndicator";
import Input from "../../components/input/Input";


// import "./Register.css";


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handle_login = async (e) => {
    e.preventDefault();
    // console.log('heading', email, password);
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });
      console.log(response.data.message);
      if (response.data.message === 'Login successful') {
        toast.success('Bienvenue!');
        // console.log(response.data.user.id);


        localStorage.setItem('UserId', response.data.user.id);
        navigate('/dashboard');
      } else if (response.data.message === 'Login failed') {
        toast.error('Invalid email or password');
        console.log(response.data.message);


      }


    } catch (error) {
      toast.error('Identifiants invalides!');
      console.log(error);

    }

    return;
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        navigate('/dashboard');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
    }

  }
  return (
    <div className="container">
      <div className="drop">
        <div className="content">
          <form class="form" method="post" onSubmit={handle_login}>
            <h2 className="animate_heartbeat">Connection</h2>
            <p class="message">Connectez-vous pour continuer l'aventure.</p>
            <div className="input" >
              <input type="email" id="email" required onChange={(e) => setEmail(e.target.value)} />
              
            </div>

            <div className="input">
              <input type="password" id="password" required onChange={(e) => setPassword(e.target.value)} />
            </div>
            {loading && <LoadingIndicator />}

            <div className="input">
              <Input
                disabled={loading}
                value={"S'inscrire"}
                type={"submit"}
                text={loading ? "Chargement ..." : "Soumettre"}
              />
            </div>
          </form>
        </div>

      </div>
      <Link to={"/OtpCode"} className="btn">Forgot Password</Link>
      <Link to={"/register"} className="btn signup">S4inscrire</Link>
    </div>
  );

}
