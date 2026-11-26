// ---------- CLASE PARA GESTIONAR LAS TAREAS ----------

class TaskManager {

    constructor(currentId = 0) {
        // Colección de tareas registradas
        this.tasks = [];
        this.currentId = currentId;
    }

    // Crear y registrar una nueva tarea
    addTask(name, description, dueDate, status, details = {}) {

        // Generar identificador único
        this.currentId++;

        // Crear el objeto de la tarea
        const newTask = {
            id: this.currentId,
            name: name,
            description: description,
            dueDate: dueDate,
            status: status,
            hora: details.hora,
            categoria: details.categoria,
            prioridad: details.prioridad
        };

        // Guardar la tarea en la colección
        this.tasks.push(newTask);

        return newTask;
    }
}