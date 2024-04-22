import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Swal from 'sweetalert2';
import logo from './img/pexels-eberhard-grossgasteiger-2310641.jpg';



const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const handleRegisterRedirect = () => {
    navigate('/register');
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const encodedEmail = encodeURIComponent(email);

    try {
      const response = await axios.get(`https://task-manager-backend-serverless.azurewebsites.net/api/GetUser/${encodedEmail}`, {
        auth: {
          username: email,
          password: password,
        }
      });
      console.log(response.data);
      if (response.data.email === email && response.data.password === password) {
        Swal.fire({
          title: 'Bienvenido!',
          text: response.data.name,
          icon: 'success',
          confirmButtonText: 'Ingresar'
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.setItem("email", email);
            navigate(`/perfil`);
          }
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Usuario o contraseña incorrectos',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'Ocurrió un error al iniciar sesión',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  };

  return (
    <body style={{ background: "#333", color: "#fff" }}>
      <div className="container">
        <div className="row">
          <div className="col-md-6" id="ladoIzquierdo">
            <div className="card" style={{ width: "28rem", background: "#333", border: "none", color: "#fff" }}>
              <div className="card-body">
                <h5 className="card-title my-5">Iniciar Sesión</h5>
                <form onSubmit={handleLogin}>
                  <div className="mb-4 py-2">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-describedby="emailHelp"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInput"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className='buttons' style={{ padding: "20px" }}>
                    <button type="submit" className="btn btn-primary" style={{margin: "0px 30px"}}>
                      Submit
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleRegisterRedirect} >
                      Registrarse
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-6" id="imagenIzquierda">
            <img src={logo} alt="Descripción de la imagen" className="img-fluid" />
          </div>
        </div>
      </div>
    </body>

  );
};

export default LoginPage;

