import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import logo from './img/pexels-eberhard-grossgasteiger-2310641.jpg'; 

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login'); 
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !lastName || !email || !password) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor completa todos los campos',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    try {
      const response = await axios.post(`https://task-manager-backend2.azurewebsites.net/api/Users/CreateUser`, {
        id: email,
        name: name,
        lastName: lastName,
        email: email,
        password: password
      });
      
      console.log(response.data);
      
      
      if (response.data.email===email) {
        Swal.fire({
          title: 'Bienvenido!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Ingresar'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.data.error,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'Ocurrió un error al registrar el usuario',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  };

  return (
    <body style={{ background :"#333", color:"#fff" }}>
      <div className="container">
      <div className="row">
        <div className="col-md-6" id="ladoIzquierdo">
          <div className="card" style={{ width: "28rem",background :"#333", border:"none", color:"#fff" }}>
            <div className="card-body">
              <h5 className="card-title my-5">Registro</h5>
              <form onSubmit={handleRegister}>
                <div className="mb-4 py-2">
                  <label htmlFor="name" className="form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-describedby="nameHelp"
                  />
                </div>
                <div className="mb-4 py-2">
                  <label htmlFor="lastName" className="form-label">
                    Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    aria-describedby="lastNameHelp"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Registrarse
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleLoginRedirect}>
                    Iniciar Sesion
                  </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6" id="imagenIzquierda">
          <img src={logo} alt="Descripción de la imagen" className="img-fluid mt-3" />
        </div>
      </div>
    </div>
    </body>
  );
};

export default RegisterPage;
