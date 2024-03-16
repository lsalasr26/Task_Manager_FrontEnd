import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
      Swal.fire({
        title: 'Bienvenido!',
        text: response.data.name,
        icon: 'success',
        confirmButtonText: 'Ingresar'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/calendar');
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'Usuario o contraseña incorrectos',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  };

  return (
<div className="login-form-container shadow p-3 mb-5 mt-5  bg-white rounded">
  <form onSubmit={handleLogin}>
    <div className="mb-3">
      <label htmlFor="email" className="form-label">
        Email:
      </label>
      <input
        type="email"
        className="form-control"
        id="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
    </div>
    <div className="mb-3">
      <label htmlFor="password" className="form-label">
        Password:
      </label>
      <input
        type="password"
        className="form-control"
        id="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    </div>
    <div className="d-grid gap-2">
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </div>
  </form>
</div>


  );
};

export default LoginPage;
