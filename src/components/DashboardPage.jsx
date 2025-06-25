import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, Row, Col, Form, Alert, Table, Modal } from 'react-bootstrap';

const initialProjects = [
  {
    id: 'proj-1',
    name: 'Desarrollo de Aplicación Web',
    status: 'En Curso', // En Curso, Completado, Pendiente, Detenido
    owner: 'Usuario A',
    tasks: [
      {
        id: 'task-1-1',
        description: 'Recolección de requerimientos',
        assignedTo: 'Usuario B',
        status: 'Listo', // Listo, En Curso, Bloqueado, Pendiente
        dueDate: '2025-07-24',

        priority: 'Media', // Baja, Media, Alta, Urgente
        difficulty: 'Baja', // Baja, Media, Alta
        notes: 'Elementos de acceso y roles.',
        subtasks: [
          { id: 'subtask-1-1-1', description: 'Reunión con cliente', completed: true },
          { id: 'subtask-1-1-2', description: 'Documentar especificaciones', completed: false },
        ],
      },
      {
        id: 'task-1-2',
        description: 'Desarrollo de Boceto',
        assignedTo: 'Usuario A',
        status: 'En Curso',
        dueDate: '2025-07-30',
        priority: 'Alta',
        difficulty: 'Media',
        notes: 'Notas de la reunión.',
        subtasks: [],
      },
       {
        id: 'task-1-3',
        description: 'Comienzo Diseño UI y UX',
        assignedTo: 'Usuario B',
        status: 'En Curso',
        dueDate: '2025-08-01',
        priority: 'Media',
        difficulty: 'Alta',
        notes: 'Crear wireframes y prototipos.',
        subtasks: [],
      },
    ],
  },
  {
    id: 'proj-2',
    name: 'Campaña de Marketing Digital',
    status: 'Pendiente',
    owner: 'Usuario C',
    tasks: [],
  },
];

// Función auxiliar para obtener un ID único
const generateUniqueId = () => Math.random().toString(36).substring(2, 9);

function DashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // Para ver tareas de un proyecto específico
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Media');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState('Baja');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');


  // Simulamos usuarios para asignar tareas
  const availableUsers = ['Usuario A', 'Usuario B', 'Usuario C', 'Usuario D'];

  // Función de cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  // Lógica para agregar un nuevo proyecto
  const handleAddProject = async (e) => {
    e.preventDefault();
    // if (newProjectName.trim()) {
    //   const newProject = {
    //     id: generateUniqueId(),
    //     name: newProjectName.trim(),
    //     status: 'Pendiente',
    //     owner: 'Yo', // Puedes hacer que el owner sea el usuario actual
    //     tasks: [],
    //   };
    //   setProjects([...projects, newProject]);

    try {
    const response = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({nombre: newProjectName.trim()}),
        credentials: 'include', // Asegúrate de enviar cookies si es necesario
      });
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      setTimeout(() => {
        window.location.reload()
         }, 1500);
      
      // if (response.ok) {
      //   setMessage('Registro exitoso! Redirigiendo a login...');
      //   setTimeout(() => {
      //   }, 1500);
      // } else {
      //   setMessage(data.message || 'Error en el registro.');
      // }
    } catch (error) {
      // setMessage('Error de red. Inténtalo de nuevo más tarde.');
      console.error(error);
    }
      setNewProjectName('');
      setShowAddProjectModal(false); // Cerrar modal después de añadir
    }

  // Lógica para agregar una nueva tarea a un proyecto seleccionado
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTaskDescription.trim() && selectedProject) {
      const newTask = {
        descripcion: newTaskDescription?.trim(),
        vencimiento: newTaskDueDate || 'N/A',
        prioridad: newTaskPriority?.toLowerCase(),
        dificultad: newTaskDifficulty?.toLowerCase(),
        project_id: selectedProject?.id
      };

      try {
        const response = await fetch(`http://localhost:8000/api/tasks`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(newTask),
          credentials: "include"
        })

        const result = await response.json();
        console.log(result);

        setTimeout(() => {
          window.location.reload()
        }, 1500);

      } catch (error) {
        console.log(`Error al crear la tarea para el proyecto: ${selectedProject.id}: `, error)
      }

      // setProjects(projects?.map(proj =>
      //   proj.id === selectedProject.id
      //     ? { ...proj, tasks: [...proj.tasks, newTask] }
      //     : proj
      // ));
      // setSelectedProject(prev => ({ // Actualiza el proyecto seleccionado para que se reflejen las tareas
      //   ...prev,
      //   tasks: [...prev.tasks, newTask]
      // }));
      setNewTaskDescription('');
      setNewTaskAssignedTo('');
      setNewTaskDueDate('');
      setNewTaskPriority('Media');
      setNewTaskDifficulty('Baja');
    }
  };

  // Función para cambiar el estado de una tarea
  const handleTaskStatusChange = (projectId, taskId, newStatus) => {
    setProjects(projects.map(proj =>
      proj.id === projectId
        ? {
            ...proj,
            tasks: proj.tasks.map(task =>
              task.id === taskId ? { ...task, status: newStatus } : task
            ),
          }
        : proj
    ));
    // Si la tarea que se actualizó pertenece al proyecto que está abierto en el modal, actualiza el modal
    setSelectedProject(prev => {
        if (prev && prev.id === projectId) {
            return {
                ...prev,
                tasks: prev.tasks.map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                ),
            };
        }
        return prev;
    });
  };

  // Función para cambiar la prioridad de una tarea
  const handleTaskPriorityChange = (projectId, taskId, newPriority) => {
    setProjects(projects.map(proj =>
      proj.id === projectId
        ? {
            ...proj,
            tasks: proj.tasks.map(task =>
              task.id === taskId ? { ...task, priority: newPriority } : task
            ),
          }
        : proj
    ));
     setSelectedProject(prev => {
        if (prev && prev.id === projectId) {
            return {
                ...prev,
                tasks: prev.tasks.map(task =>
                    task.id === taskId ? { ...task, priority: newPriority } : task
                ),
            };
        }
        return prev;
    });
  };

  // Función para cambiar la dificultad de una tarea
  const handleTaskDifficultyChange = (projectId, taskId, newDifficulty) => {
    setProjects(projects.map(proj =>
      proj.id === projectId
        ? {
            ...proj,
            tasks: proj.tasks.map(task =>
              task.id === taskId ? { ...task, difficulty: newDifficulty } : task
            ),
          }
        : proj
    ));
    setSelectedProject(prev => {
        if (prev && prev.id === projectId) {
            return {
                ...prev,
                tasks: prev.tasks.map(task =>
                    task.id === taskId ? { ...task, difficulty: newDifficulty } : task
                ),
            };
        }
        return prev;
    });
  };

  // Función para marcar/desmarcar subtarea como completada
  const handleSubtaskCompleteToggle = (projectId, taskId, subtaskId) => {
    setProjects(projects.map(proj =>
      proj.id === projectId
        ? {
            ...proj,
            tasks: proj.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    subtasks: task.subtasks.map(sub =>
                      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
                    ),
                  }
                : task
            ),
          }
        : proj
    ));
     setSelectedProject(prev => {
        if (prev && prev.id === projectId) {
            return {
                ...prev,
                tasks: prev.tasks.map(task =>
                    task.id === taskId
                        ? {
                            ...task,
                            subtasks: task.subtasks.map(sub =>
                                sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
                            ),
                        }
                        : task
                ),
            };
        }
        return prev;
    });
  };

        const logout = async() => {
        try {
          const response = await fetch("http://localhost:8000/api/auth/logout", {
            method: "GET",
            credentials: "include"
          })

          if(response.ok){
            setTimeout(() => {
              navigate('/login');
            }, 1500);
          }

          const result = await response.json();
          console.log(result)

        } catch (error) {
          console.log("Error al cerrar sesión: ", error)
        }
      }

    const getProjectsByUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users/user/projects", {
          method: "GET",
          credentials: "include"
        });

        const result = await response.json()

        const dataProjects = result.data
        // console.log(dataProjects);

        const projectsData = [];

        for(let project of dataProjects) {
          const dataTasks = await getTasksByProject(project._id)
            const data = {
              "id": project?._id,
              "name": project?.nombre,
              "status": project?.estado,
              "owner": "Este Usuario",
              "tasks": dataTasks?.map(task => {
                return {
                  "id": task?._id,
                  "description": task?.descripcion,
                  "assignedTo": task?.usuario_asignado ?? "No asignado",
                  "status": `${task?.estado?.charAt(0).toUpperCase() + task?.estado?.slice(1)}`,
                  "dueDate": task?.vencimiento ?? "Si Fecha",
                  "priority": `${task?.prioridad?.charAt(0).toUpperCase() + task?.prioridad?.slice(1)}`,
                  "difficulty": `${task?.dificultad?.charAt(0).toUpperCase() + task?.dificultad?.slice(1)}`
                }
              })
            } 
            console.log(data)
            projectsData.push(data);
        }

        setProjects(projectsData);
      } catch (error) {
        console.log("Error al obtener proyectos del usuario: ", error)
      }
    }

    const getTasksByProject = async (id) => {
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${id}/tasks`, {
          method: "GET",
          credentials: "include"
        });

        const result = await response.json()
        // console.log(result)
        return result.data
      } catch (error) {
        console.log("Error al obtener proyectos del usuario: ", error)
      }
    }

  useEffect(() => {
    // const checkAuth = async () => {
    //   try {
    //     const res = await fetch('http://127.0.0.1:8000/api/auth/check', {
    //       method: 'GET',
    //       credentials: 'include', // 🔥 Esto es importante para que se envíen las cookies
    //     });
  
    //     if (res.ok) {
    //       setIsAuthenticated(true);
    //     } else {
    //       setIsAuthenticated(false);
    //     }
    //   } catch (err) {
    //     console.error('Error verificando autenticación', err);
    //     setIsAuthenticated(false);
    //   }
    // };
  
    // checkAuth();

    getProjectsByUser()

  }, []);

  // Función para calcular el estado del proyecto (muy básico por ahora)
  const getProjectStatus = (projectTasks) => {
    if (projectTasks.length === 0) return 'Pendiente';
    const completedTasks = projectTasks.filter(task => task.status === 'Listo').length;
    if (completedTasks === projectTasks.length) return 'Completado';
    if (completedTasks > 0 && completedTasks < projectTasks.length) return 'En Curso';
    return 'Pendiente';
  };


  return (
    <Container fluid className="dashboard-container p-4" style={{ backgroundColor: '#f5f7f9', minHeight: '100vh' }}>
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="text-primary">Panel de Proyectos <span className="text-muted fs-6"></span></h2>
        </Col>
        <Col className="text-end">
          <Button variant="outline-primary" onClick={() => setShowAddProjectModal(true)}>
            {/* <FaPlus className="me-2" /> */}
            Agregar Proyecto
          </Button>
          <Button variant="danger" onClick={logout} className="ms-3">
            Cerrar Sesión
          </Button>
        </Col>
      </Row>

      {/* Sección de Proyectos */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white py-3">
          <h4 className="mb-0">Tus Proyectos</h4>
        </Card.Header>
        <Card.Body>
          {projects?.length == 0 ? (
            <Alert variant="info" className="text-center">No hay proyectos. ¡Crea uno!</Alert>
          ) : (
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>Nombre del Proyecto</th>
                  <th>Estado</th>
                  <th>Owner</th>
                  <th>Tareas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {projects?.map((project) => (
                  <tr key={project?.id}>
                    <td>{project?.name}</td>
                    <td>
                      <span className={`badge ${
                        getProjectStatus(project.tasks) === 'completado' ? 'bg-success' :
                        getProjectStatus(project.tasks) === 'en curso' ? 'bg-warning text-dark' :
                        'bg-secondary'
                      }`}>
                        {getProjectStatus(project.tasks)}
                      </span>
                    </td>
                    <td>{project?.owner}</td>
                    <td>{project?.tasks?.length}</td>
                    <td>
                      <Button variant="outline-info" size="sm" onClick={() => setSelectedProject(project)}>
                        Ver Tareas
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal para Agregar Proyecto */}
      <Modal show={showAddProjectModal} onHide={() => setShowAddProjectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProject}>

            <Form.Group className="mb-3" controlId="newProjectName">
              <Form.Label>Nombre del Proyecto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. Diseño de Nueva Web"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Crear Proyecto
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para Ver y Gestionar Tareas del Proyecto Seleccionado */}
      <Modal show={!!selectedProject} onHide={() => setSelectedProject(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tareas del Proyecto: {selectedProject?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <>
              {/* Formulario para agregar nueva tarea */}
              <h5 className="mb-3">Agregar Nueva Tarea</h5>
              <Form onSubmit={handleAddTask} className="mb-4 p-3 border rounded bg-light">
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="newTaskDescription">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Descripción de la tarea"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="newTaskAssignedTo">
                      <Form.Label>Asignado a</Form.Label>
                      <Form.Select
                        value={newTaskAssignedTo}
                        onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                      >
                        <option value="">Seleccionar Usuario</option>
                        {availableUsers.map(user => (
                          <option key={user} value={user}>{user}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group controlId="newTaskPriority">
                            <Form.Label>Prioridad</Form.Label>
                            <Form.Select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                                <option value="Urgente">Urgente</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="newTaskDifficulty">
                            <Form.Label>Dificultad</Form.Label>
                            <Form.Select value={newTaskDifficulty} onChange={(e) => setNewTaskDifficulty(e.target.value)}>
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="newTaskDueDate">
                            <Form.Label>Vencimiento</Form.Label>
                            <Form.Control
                                type="date"
                                value={newTaskDueDate}
                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="success" type="submit" className="w-100">
                  Agregar Tarea
                </Button>
              </Form>

              {/* Tabla de Tareas */}
              <h5 className="mb-3">Lista de Tareas</h5>
              {selectedProject.tasks.length === 0 ? (
                <Alert variant="info" className="text-center">Este proyecto no tiene tareas aún.</Alert>
              ) : (
                <Table responsive striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Tarea</th>
                      <th>Asignado a</th>
                      <th>Vencimiento</th>
                      <th>Prioridad</th>
                      <th>Dificultad</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.tasks.map((task) => (
                      <React.Fragment key={task.id}> {/* Usamos Fragment para agrupar fila de tarea y subtareas */}
                        <tr>
                          <td>{task.description}</td>
                          <td>{task.assignedTo}</td>
                          <td>{task.dueDate}</td>
                          <td>
                            <Form.Select
                              value={task.priority}
                              onChange={(e) => handleTaskPriorityChange(selectedProject.id, task.id, e.target.value)}
                              className={`form-select-sm ${
                                task.priority === 'Alta' || task.priority === 'Urgente' ? 'bg-danger text-white' :
                                task.priority === 'Media' ? 'bg-warning text-dark' : 'bg-info'
                              }`}
                            >
                              <option value="Baja">Baja</option>
                              <option value="Media">Media</option>
                              <option value="Alta">Alta</option>
                              <option value="Urgente">Urgente</option>
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Select
                              value={task.difficulty}
                              onChange={(e) => handleTaskDifficultyChange(selectedProject.id, task.id, e.target.value)}
                              className={`form-select-sm ${
                                task.difficulty === 'Alta' ? 'bg-danger text-white' :
                                task.difficulty === 'Media' ? 'bg-warning text-dark' : 'bg-info'
                              }`}
                            >
                              <option value="Baja">Baja</option>
                              <option value="Media">Media</option>
                              <option value="Alta">Alta</option>
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Select
                              value={task.status}
                              onChange={(e) => handleTaskStatusChange(selectedProject.id, task.id, e.target.value)}
                              className={`form-select-sm ${
                                task.status === 'Listo' ? 'bg-success text-white' :
                                task.status === 'En Curso' ? 'bg-primary text-white' :
                                task.status === 'Bloqueado' ? 'bg-danger text-white' : 'bg-secondary text-white'
                              }`}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="En Curso">En Curso</option>
                              <option value="Listo">Listo</option>
                              <option value="Bloqueado">Bloqueado</option>
                            </Form.Select>
                          </td>
                          <td>
                            {/* Aquí podríamos añadir botones para editar/eliminar la tarea */}
                          </td>
                        </tr>
                        {/* Mostrar subtareas si las hay */}
                        {task?.subtasks?.length > 0 && (
                          <tr>
                            <td colSpan="7" className="p-0">
                              <ul className="list-group list-group-flush border-top">
                                {task.subtasks.map(subtask => (
                                  <li key={subtask.id} className="list-group-item d-flex align-items-center">
                                    <Form.Check
                                      type="checkbox"
                                      id={`subtask-${subtask.id}`}
                                      label={subtask.description}
                                      checked={subtask.completed}
                                      onChange={() => handleSubtaskCompleteToggle(selectedProject.id, task.id, subtask.id)}
                                      className="me-2"
                                    />
                                    {subtask.completed && <span className="text-success small"> (Completada)</span>}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedProject(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DashboardPage;
