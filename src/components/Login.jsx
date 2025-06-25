import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // ------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(''); // Limpiar mensajes anteriores

    console.log('Intentando iniciar sesión:', { username, password });

   try {
    const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
        credentials: 'include', // Asegúrate de enviar cookies si es necesario
      });
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      if (response.ok)
         { setIsAuthenticated(true);
        setMessage('Inicio de sesión exitoso! Redirigiendo a Dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setMessage(data.message || 'Error en el Iniciar sesión.');
      }
    } catch (error) {
      setMessage('Error de red. Inténtalo de nuevo más tarde.');
      console.error(error);
    }

    // Opcional: Limpiar campos después de un intento de login fallido si lo deseas
    // setUsername('');
    // setPassword('');
  };

  return (
    <Container className="mt-5 col-4">
      <Card className="p-4 shadow">
        <Card.Title as="h2" className="text-center mb-4">Iniciar Sesión</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="loginUsername">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Contraseña:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Iniciar Sesión
          </Button>
        </Form>
        {message && (
          <Alert variant={message.includes('exitoso') ? 'success' : 'danger'} className="mt-3">
            {message}
          </Alert>
        )}

      </Card>
    </Container>
  );
}

export default Login;
