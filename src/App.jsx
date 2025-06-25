    import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
    import { Button, Navbar, Nav, Container, Alert } from 'react-bootstrap';

    // Importa tus componentes de página
    import Register from './components/Register';
    import Login from './components/Login';
    import DashboardPage from './components/DashboardPage'; // ¡Importa este componente!

    function App() {
      // const navigate = useNavigate();
      const [isAuthenticated, setIsAuthenticated] = useState(false);


      const logout = async() => {
        try {
          const response = await fetch("http://localhost:8000/api/auth/logout", {
            method: "GET",
            credentials: "include"
          })

          if(response.ok){
            setTimeout(() => {
              // navigate('/login');
            }, 1500);
          }

          const result = await response.json();
          console.log(result)

        } catch (error) {
          console.log("Error al cerrar sesión: ", error)
        }
      }

      useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/check', {
        method: 'GET',
        credentials: 'include', // 🔥 Esto es importante para que se envíen las cookies
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error verificando autenticación', err);
      setIsAuthenticated(false);
    }
  };

  checkAuth();
}, []);

      return (
        <Router>
          <Navbar bg="light" expand="lg" className="mb-4">
            <Container>
              <Navbar.Brand as={Link} to="/">Mi App de Proyectos</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  {!isAuthenticated && (
                    <>
                      <Nav.Link as={Link} to="/register">Registro</Nav.Link>
                      <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    </>
                  )}
                  {isAuthenticated && (
                    <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  )}
                </Nav>
                {isAuthenticated && (
                  <Nav>
                    <Nav.Link onClick={logout}>Cerrar Sesión</Nav.Link>
                  </Nav>
                )}
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            
            {isAuthenticated ? (
              <Route path="/dashboard" element={<DashboardPage />} />
            ) : (
              <Route path="/dashboard" element={<Alert variant="warning" className="text-center mt-5">Necesitas iniciar sesión para ver el dashboard.</Alert>} />
            )}
            {/* Ruta raíz redirige al dashboard si está autenticado, de lo contrario al login */}
            <Route path="/" element={isAuthenticated ? <DashboardPage /> : <Login setIsAuthenticated={setIsAuthenticated} />} />

            <Route path="*" element={<h3 className="text-center mt-5">404 - Página no encontrada</h3>} />
          </Routes>
        </Router>
      );
    }

    export default App;
    