Ejercicio 1:http://localhost:8000/api/employees
Ejercicio 2:http://localhost:8000/api/employees/page=1
Ejercicio 3:http://localhost:8000/api/employees/page=N      donde N es el número de página deseado
Ejercicio 4:http://localhost:8000/api/employees/oldest
Ejercicio 5:http://localhost:8000/api/employees?user=true
Ejercicio 6 en postman:http://localhost:8000/api/employees
    Ve a la pestaña "Body" en la parte inferior de la ventana de Postman.
    Selecciona el formato JSON.
    En el cuerpo de la solicitud, proporciona los datos del nuevo empleado en formato JSON. Por ejemplo:
        {
        "name": "Nuevo Empleado",
        "age": 30,
        "department": "IT",
        "privileges": "user"
        }
    Haz clic en el botón "Send" para enviar la solicitud.
    Postman enviará la solicitud POST al servidor Express.
    Verás la respuesta del servidor en la sección de respuesta de Postman, que debería incluir los datos del nuevo empleado que has agregado.

Ejercicio 7:
Ejercicio 8: