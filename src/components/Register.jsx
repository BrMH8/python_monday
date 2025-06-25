import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link también

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(''); // Limpiar mensajes anteriores

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // --- Lógica de registro (simulada) ---
    console.log('Intentando registrar:', { username, password });
    // Aquí harías tu llamada a la API de backend, ej:
    try {
    const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, contrasenia: password }),
      });
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      if (response.ok) {
        setMessage('Registro exitoso! Redirigiendo a login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setMessage(data.message || 'Error en el registro.');
      }
    } catch (error) {
      setMessage('Error de red. Inténtalo de nuevo más tarde.');
      console.error(error);
    }

    // Simulación de éxito para el ejemplo actual
    setMessage('Registro exitoso! Redirigiendo a login...');
    setUsername('');
    setPassword('');
    setConfirmPassword('');

    // Redirige al login después de un breve retraso
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <Container className="mt-5 col-5">
      <Card className="p-4 shadow">
        <Card.Title as="h2" className="text-center mb-4">Registro de Usuario</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Correo Electronico:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirmar Contraseña:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Registrarse
          </Button>
        </Form>
        {message && (
          <Alert variant={message.includes('exitoso') ? 'success' : 'danger'} className="mt-3">
            {message}
          </Alert>
        )}
        <div className="text-center mt-3">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </Card>
    </Container>
  );
}

export default Register;
