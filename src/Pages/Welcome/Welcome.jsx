import React, { useEffect } from "react";
import "./css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
// AOS.init();

import photo from "../../assets/hero-image.png";
import photo1 from "../../assets/40138-removebg-preview.png";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Welcome() {
  useEffect(() => {
    AOS.init();
    // ..
    // Simule le comportement de window.onload avec useEffect

    // Simule window.onload
    // window.setTimeout(fadeout, 500);
  }, []);
  return (
    <div style={{ Height: "100vh" }}>
      <header class="header navbar-area">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-12">
              <div class="nav-inner">
                <nav
                  class="navbar navbar-expand-lg "
                  data-aos="fade-down"
                  data-aos-duration="3000"
                >
                  <Link
                    to="/"
                    class="navbar-brand"
                    style={{
                      color: "#4d51d8",
                      fontWeight: "bold",
                      fontSize: "40px"
                    }}
                  >
                    <img
                      src={photo1}
                      style={{ width: "100px" }}
                      alt="Logo"
                    />ChatterBox
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section class="hero-area">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-5 col-md-12 col-12">
              <div class="hero-content">
                <div data-aos="zoom-in-down" data-aos-duration="3000">
                  <h4>VenceChat.</h4>
                </div>
                <h1>
                  <div data-aos="flip-up" data-aos-duration="3000">
                    La Meilleure Application pour<br />
                    la gestion de vos groupes.
                  </div>
                </h1>
                <p>
                  <div data-aos="fade-up-left" data-aos-duration="3000">
                    ChatterBox est une application web qui vous permet de créer,
                    gérer et organiser des groupes. <br /> <br />
                    <div
                      style={{
                        fontStyle: "italic",
                        fontSize: "20px",
                        fontFamily: "Sedgwick Ave"
                      }}
                    >
                      Vous pouvez partager des informations, discuter, et
                      travailler en équipe.
                    </div>
                    {/* Simplifiez la gestion de vos équipes et de vos projets grâce à notre
  application. <br />
  Optimisez votre productivité et collaborez sans effort. */}
                  </div>
                </p>
                {/* <div data-aos="zoom-in-right"></div> */}
                <div
                  data-aos="zoom-out-up"
                  data-aos-duration="3000"
                  class="button"
                >
                  <Link to="/login">
                    <button class="animated-button">
                      <svg
                        viewBox="0 0 24 24"
                        class="arr-2"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                      </svg>
                      <span class="text">Commencer</span>
                      <span class="circle" />
                      <svg
                        viewBox="0 0 24 24"
                        class="arr-1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                      </svg>
                    </button>

                    {/* Commencer */}
                  </Link>
                </div>
              </div>
            </div>
            <div
              class="col-lg-7 col-12"
              data-aos="fade-left"
              data-aos-duration="3000"
            >
              <div class="hero-image" >
                <img class="main-image" src={photo} alt="#" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
