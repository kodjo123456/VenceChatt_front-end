import React from 'react'
import './Dashboard.css'
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="drop">
        <div className="content">
          <h1>Soyer les bienvenue!</h1>
          <p>VenceChat vous souhaite un mot de bienvenu sur le site!</p>
          <div className="input">
          <Link to={"/chat"}> <button id="continueBtn">Pges suivantes</button></Link>
          </div>
          {/* <button  > Continuer</button> */}
        </div>
      </div>
    </div>
  );
}
