import React from 'react'
import './NotFound.css'
import { Link, useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate();
  return (
    <div class="">
        <div class="noise"></div>
<div class="overlay"></div>
<div class="terminal">
  <h1><span style={{color:"red"}}>ERREUR</span>  <span class="errorcode">404</span></h1>
  <p class="output">La page que vous recherchez a peut-être été supprimée, son nom a été modifié ou elle est temporairement indisponible.</p>
  <p class="output">Veuillez <Link to={navigate(-1)}>Retourner en arriere</Link> ou  <Link to={"/"}>Aller a la page d'accueil</Link>.</p>
  <p class="output">Bonne chance!</p>
</div>
    </div>
  )
}
