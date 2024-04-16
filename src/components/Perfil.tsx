import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    async function fetchData() {
      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await axios.get(`https://task-manager-backend-serverless.azurewebsites.net/api/GetUser/${encodedEmail}`);
        const userData = response.data;
        setName(userData.name);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setPassword(userData.password);
      } catch (error) {
        console.error(error);
        // Manejar errores de la solicitud
      }
    }
    fetchData();
  }, [email]); // Ejecutar el efecto solo cuando cambie el email

  const handleLoginRedirect = () => {
    navigate('/login'); 
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(` https://task-manager-backend-serverless.azurewebsites.net/api/UpdateUser/${email}`, {
        name,
        lastName,
        email,
        password
      });
      console.log(response.data);
      Swal.fire({
        title: 'Actualización exitosa!',
        text: 'Los datos se han actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then(() => {
        // Redireccionar a otra página si es necesario
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'Ocurrió un error al actualizar los datos del usuario',
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
              <h5 className="card-title my-5">Actualizar Datos</h5>
              <form onSubmit={handleUpdate}>
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
                  Actualizar Datos
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleLoginRedirect}>
                    Iniciar Sesión
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
