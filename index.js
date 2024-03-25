const express = require('express');
const fs = require('fs'); // Importa la librería fs

const app = express();
const PORT = 8000;
const EMPLOYEES_FILE_PATH = './employees.json'; // Ruta al archivo employees.json

// Middleware para manejar el contenido JSON
app.use(express.json());

// Función para obtener los empleados según el número de página
function getEmployeesByPage(page) {
  const pageSize = 2;
  const startIndex = pageSize * (page - 1);
  const endIndex = startIndex + 1;

  const employeesData = require(EMPLOYEES_FILE_PATH);
  return employeesData.slice(startIndex, endIndex + 1);
}

// Función para obtener el empleado más antiguo
function getOldestEmployee(employees) {
  let oldestEmployee = employees[0];
  for (let i = 1; i < employees.length; i++) {
    if (employees[i].age > oldestEmployee.age) {
      oldestEmployee = employees[i];
    }
  }
  return oldestEmployee;
}

// Ruta para obtener todos los empleados
app.get('/api/employees', (req, res) => {
  try {
    // Cargar los datos del archivo employees.json
    const employeesData = require(EMPLOYEES_FILE_PATH);

    // Verificar si se proporcionó el parámetro 'user' en la consulta y si su valor es 'true'
    const isUserRequested = req.query.user === 'true';

    // Si se proporciona el parámetro 'user', filtrar los empleados con privilegios 'user'
    if (isUserRequested) {
        const filteredUserEmployees = employeesData.filter(employee => employee.privileges === 'user');
        res.json(filteredUserEmployees);
    } else if (req.query.badges) {
        // Si se proporciona el parámetro 'badges', filtrar los empleados que incluyan el valor proporcionado en el atributo "badges"
        const badgeEmployees = employeesData.filter(employee => employee.badges && employee.badges.includes(req.query.badges));
        res.json(badgeEmployees);
    } else {
        // Si no se proporciona ninguno de los parámetros anteriores, devolver todos los empleados
        res.json(employeesData);
    }
} catch (error) {
    // Manejar cualquier error que ocurra al cargar el archivo o al procesar los datos
    console.error("Error al cargar los empleados:", error);
    res.status(500).json({ error: 'Error al obtener los empleados' });
}
});

// Ruta para obtener los empleados según la página especificada
app.get('/api/employees', (req, res) => {
  try {
    // Cargar los datos del archivo employees.json
    const employeesData = require(EMPLOYEES_FILE_PATH);

    // Obtener el valor de la página desde la consulta
    const page = parseInt(req.query.page); // Parsea el valor de la página a un número entero

    // Determinar los índices de inicio y fin para los empleados a devolver
    const pageSize = 2; // Número de empleados por página
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Obtener los empleados para la página especificada
    const employeesForPage = employeesData.slice(startIndex, endIndex);

    // Devolver los empleados correspondientes a la página solicitada en formato JSON
    res.json(employeesForPage);
  } catch (error) {
    // Manejar cualquier error que ocurra al cargar el archivo o al procesar los datos
    res.status(500).json({ error: 'Error al obtener los empleados' });
  }
});

// Ruta para obtener empleados por página
app.get('/api/employees/page=:page', (req, res) => {
  try {
    const page = parseInt(req.params.page);
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: 'Número de página no válido' });
    }

    const employeesData = require(EMPLOYEES_FILE_PATH);
    const pageSize = 2;
    const startIndex = 2 * (page - 1);
    const endIndex = startIndex + 1;
    const employees = employeesData.slice(startIndex, endIndex + 1);
    
    res.json(employees);
  } catch (error) {
    // Manejar cualquier error que ocurra al cargar el archivo o al procesar los datos
    res.status(500).json({ error: 'Error al obtener los empleados por página' });
  }
});

// Ruta para obtener el empleado más antiguo
app.get('/api/employees/oldest', (req, res) => {
  try {
    // Cargar los datos del archivo employees.json
    const employeesData = require(EMPLOYEES_FILE_PATH);

    // Obtener el empleado más antiguo
    const oldestEmployee = getOldestEmployee(employeesData);

    // Devolver el empleado más antiguo como respuesta en formato JSON
    res.json(oldestEmployee);
  } catch (error) {
    // Manejar cualquier error que ocurra al cargar el archivo o al procesar los datos
    res.status(500).json({ error: 'Error al obtener el empleado más antiguo' });
  }
});

// Ruta para agregar un nuevo empleado
app.post('/api/employees', (req, res) => {
  try {
    // Verificar si el cuerpo de la solicitud es un objeto JSON válido
    if (!req.body || typeof req.body !== 'object') {
      console.error('El cuerpo de la solicitud no es un objeto JSON válido');
      return res.status(400).json({ code: 'bad_request' });
    }

    // Cargar los datos del archivo employees.json
    const employeesData = require(EMPLOYEES_FILE_PATH);

    // Agregar el nuevo empleado al final del array de empleados
    employeesData.push(req.body);

    // Escribir los datos actualizados en el archivo employees.json
    fs.writeFileSync(EMPLOYEES_FILE_PATH, JSON.stringify(employeesData, null, 2));
    
    console.log('Empleado agregado correctamente:', req.body);

    // Devolver una respuesta con el empleado agregado
    res.status(201).json(req.body);
  } catch (error) {
    console.error('Error al agregar el empleado:', error);
    // Manejar cualquier error que ocurra al cargar el archivo o al procesar los datos
    res.status(500).json({ error: 'Error al agregar el empleado' });
  }
});

// Ruta para obtener un empleado por su nombre
app.get('/api/employees/:name', (req, res) => {
    try {
      // Cargar los datos del archivo employees.json
      const employeesData = require(EMPLOYEES_FILE_PATH);
  
      // Obtener el nombre del empleado desde los parámetros de la solicitud
      const name = req.params.name;
  
      // Buscar el empleado por su nombre
      const employee = employeesData.find(employee => employee.name === name);
  
      // Si se encuentra el empleado, devolverlo como respuesta en formato JSON
      if (employee) {
        res.json(employee);
      } else {
        // Si no se encuentra el empleado, devolver un código de estado 404 con un mensaje de error
        res.status(404).json({ code: 'not_found' });
      }
    } catch (error) {
      // Manejar cualquier error que ocurra al cargar el archivo o al procesar los datos
      res.status(500).json({ error: 'Error al obtener el empleado por nombre' });
    }
});
  

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
