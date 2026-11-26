// ---------- CLASE PARA GESTIONAR LAS TAREAS ----------

class TaskManager {

    constructor(currentId = 0, initialTasks = []) {
        // Colección de tareas registradas.
        this.tasks = [];
        this.currentId = currentId;
        this.storageKey = 'planificadorTareas';

        this.load(initialTasks);
    }

    // Cargar las tareas guardadas o iniciar con los ejemplos.
    load(initialTasks = []) {

        const savedTasks = localStorage.getItem(this.storageKey);
        const savedId = localStorage.getItem(this.storageKey + '_currentId');

        if (savedTasks !== null) {
            this.tasks = JSON.parse(savedTasks);
            this.currentId = savedId !== null
                ? Math.max(this.currentId, Number(savedId))
                : this.currentId;
        } else {
            this.tasks = initialTasks.map(function (task) {
                return {
                    id: task.id,
                    name: task.titulo,
                    description: task.notas,
                    dueDate: task.fecha,
                    status: task.status,
                    hora: task.hora,
                    categoria: task.categoria,
                    prioridad: task.prioridad
                };
            });
        }

        // Mantener el identificador por encima del último ID registrado.
        if (this.tasks.length > 0) {
            const ultimoId = Math.max(...this.tasks.map(function (task) {
                return task.id;
            }));

            this.currentId = Math.max(this.currentId, ultimoId);
        }

        this.save();
    }

    // Guardar las tareas y el último identificador utilizado.
    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
        localStorage.setItem(this.storageKey + '_currentId', this.currentId);
    }

    // Crear y registrar una nueva tarea.
    addTask(name, description, dueDate, status, details = {}) {

        this.currentId++;

        const newTask = {
            id: this.currentId,
            name: name,
            description: description,
            dueDate: dueDate,
            status: status,
            hora: details.hora || '',
            categoria: details.categoria,
            prioridad: details.prioridad
        };

        this.tasks.push(newTask);

        return newTask;
    }

    // Eliminar una tarea según su identificador.
    deleteTask(taskId) {

        const newTasks = [];

        for (let task of this.tasks) {
            if (task.id !== taskId) {
                newTasks.push(task);
            }
        }

        this.tasks = newTasks;
    }
}