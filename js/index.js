// ---------- SELECCIONAR ELEMENTOS DEL HTML ----------

const formTarea = document.querySelector('#formTarea');
const tituloInput = document.querySelector('#tituloTarea');
const notasInput = document.querySelector('#notasTarea');
const fechaInput = document.querySelector('#fechaTarea');
const horaInput = document.querySelector('#horaTarea');
const categoriaSelect = document.querySelector('#categoriaTarea');
const prioridadSelect = document.querySelector('#prioridadTarea');
const listaTareas = document.querySelector('#listaTareas');
const listaTareasDia = document.querySelector('#listaTareasDia');
const contadorTareasDia = document.querySelector('#contadorTareasDia');
const contadorTitulo = document.querySelector('#contadorTitulo');
const contadorNotas = document.querySelector('#contadorNotas');
const mensajeSinTareas = document.querySelector('#mensajeSinTareas');
const btnTodas = document.querySelector('#btnTodas');
const btnPendientes = document.querySelector('#btnPendientes');
const btnCompletadas = document.querySelector('#btnCompletadas');

// Colores de la paleta del planificador (para SweetAlert)
const COLOR_PRINCIPAL = '#946580';
const COLOR_TEXTO = '#57354D';


// ---------- TAREAS DE EJEMPLO ----------

const tareasIniciales = [
    {
        id: 1,
        titulo: 'Estudiar JavaScript',
        notas: 'Revisar conceptos de arrays y objetos',
        fecha: '2026-11-25',
        hora: '15:00',
        categoria: 'estudio',
        prioridad: 'alta',
        status: 'PORHACER'
    },
    {
        id: 2,
        titulo: 'Comprar ingredientes',
        notas: 'Comprar frutas y verduras para la semana: manzana, pera, brocoli, lechuga, tomate',
        fecha: '2026-11-07',
        hora: '19:00',
        categoria: 'salud',
        prioridad: 'media',
        status: 'PORHACER'
    },
    {
        id: 3,
        titulo: 'Leer un libro',
        notas: 'Continuar con el capítulo 4',
        fecha: '2026-11-08',
        hora: '20:00',
        categoria: 'ocio',
        prioridad: 'baja',
        status: 'PORHACER'
    },
    {
        id: 4,
        titulo: 'Llamar a mamá',
        notas: 'Preguntar cómo estuvo su semana',
        fecha: '2026-11-09',
        hora: '17:00',
        categoria: 'personal',
        prioridad: 'media',
        status: 'PORHACER'
    },
    {
        id: 5,
        titulo: 'Preparar presentación',
        notas: 'Organizar las diapositivas del proyecto',
        fecha: '2026-11-10',
        hora: '08:00',
        categoria: 'trabajo',
        prioridad: 'alta',
        status: 'PORHACER'
    }
];


// ---------- INSTANCIA DE TASKMANAGER ----------

// Los identificadores del 1 al 5 pertenecen a las tareas de ejemplo.
const taskManager = new TaskManager(5, tareasIniciales);


// ---------- OBTENER LAS TAREAS ----------

// Obtener todas las tareas desde una única colección.
function obtenerTareas() {

    return taskManager.tasks.map(function (tarea) {

        return {
            id: tarea.id,
            titulo: tarea.name,
            notas: tarea.description,
            fecha: tarea.dueDate,
            hora: tarea.hora,
            categoria: tarea.categoria,
            prioridad: tarea.prioridad,
            status: tarea.status
        };
    });
}


// ---------- LEER LOS DATOS DEL FORMULARIO ----------

function getFormData() {

    return {
        titulo: tituloInput.value,
        notas: notasInput.value,
        fecha: fechaInput.value,
        hora: horaInput.value,
        categoria: categoriaSelect.value,
        prioridad: prioridadSelect.value
    };
}


// ---------- CONTADOR DE CARACTERES DEL FORMULARIO ----------

function actualizarContador(input, contador, maximo) {

    const caracteres = input.value.length;
    contador.textContent = `${caracteres}/${maximo}`;
}

tituloInput.addEventListener('input', function () {
    actualizarContador(tituloInput, contadorTitulo, 100);
});

notasInput.addEventListener('input', function () {
    actualizarContador(notasInput, contadorNotas, 250);
});


// ---------- VALIDAR DATOS DEL FORMULARIO ----------

// Devuelve una lista de errores. Una lista vacía significa que el formulario es válido.
function validFormFieldInput(data) {

    const errores = [];

    if (data.titulo.trim() === '') {
        errores.push({
            idCampo: 'tituloTarea',
            mensaje: 'Escribe un título para la tarea'
        });
    }

    if (data.fecha === '') {
        errores.push({
            idCampo: 'fechaTarea',
            mensaje: 'Selecciona una fecha'
        });
    }

    if (data.categoria === '') {
        errores.push({
            idCampo: 'categoriaTarea',
            mensaje: 'Elige una categoría'
        });
    }

    if (data.prioridad === '') {
        errores.push({
            idCampo: 'prioridadTarea',
            mensaje: 'Elige una prioridad'
        });
    }

    // Notas y hora son opcionales.
    return errores;
}


// Comprobar si el formulario está completamente vacío.
function formularioVacio(data) {

    return Object.values(data).every(function (valor) {
        return valor.trim() === '';
    });
}


// ---------- ALERTAS (SWEETALERT2) ----------

// Caso 1: formulario vacío.
function alertaFormularioVacio() {

    return Swal.fire({
        icon: 'warning',
        title: 'Aún no has completado nada',
        text: 'Llena los campos marcados con * para crear tu tarea.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: COLOR_PRINCIPAL,
        iconColor: COLOR_PRINCIPAL,
        color: COLOR_TEXTO,
        returnFocus: false
    });
}


// Caso 2: faltan datos.
function alertaCamposIncompletos(errores) {

    const items = errores.map(function (error) {
        return '<li>' + error.mensaje + '</li>';
    }).join('');

    return Swal.fire({
        icon: 'warning',
        title: 'Faltan algunos datos',
        html: '<p class="mb-2">Para guardar la tarea, completa:</p>' +
            '<ul style="text-align:left; display:inline-block; margin:0;">' +
            items +
            '</ul>',
        confirmButtonText: 'Entendido',
        confirmButtonColor: COLOR_PRINCIPAL,
        iconColor: COLOR_PRINCIPAL,
        color: COLOR_TEXTO,
        returnFocus: false
    });
}


// Confirmar que la tarea se registró correctamente.
function alertaTareaGuardada() {

    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Tarea agregada',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        iconColor: COLOR_PRINCIPAL,
        color: COLOR_TEXTO
    });
}


// Confirmar que la tarea se eliminó correctamente.
function alertaTareaEliminada() {

    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Tarea eliminada',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        iconColor: COLOR_PRINCIPAL,
        color: COLOR_TEXTO
    });
}


// Marcar en rojo los campos que contienen errores.
function marcarCamposInvalidos(errores) {

    errores.forEach(function (error) {
        document.getElementById(error.idCampo).classList.add('is-invalid');
    });
}


// Quitar las marcas de error anteriores.
function limpiarCamposInvalidos() {

    formTarea.querySelectorAll('.is-invalid').forEach(function (campo) {
        campo.classList.remove('is-invalid');
    });
}


// ---------- PINTAR LAS TAREAS EN LA TABLA ----------

// Convierte una fecha ISO en el formato "25 nov 2026".
const MESES = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
];

function formatearFecha(fechaISO) {

    const partes = fechaISO.split('-');

    return partes[2] + ' ' +
        MESES[Number(partes[1]) - 1] + ' ' +
        partes[0];
}


// Colores de las etiquetas según la opción seleccionada.
const COLOR_CATEGORIA = {
    trabajo: 'bg-primary-subtle text-primary-emphasis',
    personal: 'bg-secondary-subtle text-secondary-emphasis',
    estudio: 'bg-info-subtle text-info-emphasis',
    salud: 'bg-success-subtle text-success-emphasis',
    ocio: 'bg-warning-subtle text-warning-emphasis'
};

const COLOR_PRIORIDAD = {
    alta: 'bg-danger-subtle text-danger-emphasis',
    media: 'bg-warning-subtle text-warning-emphasis',
    baja: 'bg-success-subtle text-success-emphasis'
};


// Poner la primera letra en mayúscula.
function capitalizar(texto) {

    return texto.charAt(0).toUpperCase() + texto.slice(1);
}


// Convertir caracteres especiales en texto seguro.
function escapeHTML(texto) {

    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


// Devolver el HTML de una fila de la tabla.
function crearFilaTarea(tarea) {

    const titulo = escapeHTML(tarea.titulo);
    const notas = escapeHTML(tarea.notas);

    const completada = tarea.status === 'COMPLETADA';

    // Notas opcionales.
    const celdaNotas = tarea.notas.trim() === ''
        ? '<span class="text-secondary">—</span>'
        : '<span class="d-block text-truncate" title="' +
        notas + '">' + notas + '</span>';

    // Hora opcional.
    const celdaHora = tarea.hora === ''
        ? '<span class="text-secondary">—</span>'
        : '<i class="bi bi-clock me-1 text-secondary" aria-hidden="true"></i>' +
        '<time datetime="' + tarea.hora + '">' + tarea.hora + '</time>';

    return '' +
        '<tr data-task-id="' + tarea.id + '" class="' +
        (completada ? 'table-secondary text-secondary opacity-50' : '') +
        '">' +

        // Checkbox.
        '<td class="text-center">' +
        '<input class="form-check-input" type="checkbox" ' +
        (completada ? 'checked ' : '') +
        'id="tarea-' + tarea.id + '" ' +
        'data-id="' + tarea.id + '" ' +
        'aria-label="Completar ' + titulo + '">' +
        '</td>' +

        // Nombre de la tarea.
        '<td class="text-start">' +
        '<label for="tarea-' + tarea.id +
        '" class="d-block text-truncate mb-0 fw-normal ' +
        (completada ? 'text-decoration-line-through' : '') +
        '" title="' + titulo + '">' +
        titulo +
        '</label>' +
        '</td>' +

        // Descripción.
        '<td class="text-start">' + celdaNotas + '</td>' +

        // Fecha.
        '<td class="text-start text-nowrap">' +
        '<i class="bi bi-calendar-event me-1 text-secondary" aria-hidden="true"></i>' +
        '<time datetime="' + tarea.fecha + '">' +
        formatearFecha(tarea.fecha) +
        '</time>' +
        '</td>' +

        // Hora.
        '<td class="text-start text-nowrap">' + celdaHora + '</td>' +

        // Categoría.
        '<td class="text-start">' +
        '<span class="badge rounded-pill fw-normal ' +
        COLOR_CATEGORIA[tarea.categoria] + '">' +
        capitalizar(tarea.categoria) +
        '</span>' +
        '</td>' +

        // Prioridad.
        '<td class="text-start">' +
        '<span class="badge rounded-pill fw-normal ' +
        COLOR_PRIORIDAD[tarea.prioridad] + '">' +
        capitalizar(tarea.prioridad) +
        '</span>' +
        '</td>' +

        // Botones de acciones.
        '<td>' +
        '<div class="d-flex justify-content-center gap-3">' +

        '<button type="button" class="btn btn-sm text-secondary p-0" ' +
        'aria-label="Editar tarea">' +
        '<i class="bi bi-pencil"></i>' +
        '</button>' +

        '<button type="button" class="btn btn-sm text-secondary p-0 delete-button" ' +
        'aria-label="Eliminar tarea">' +
        '<i class="bi bi-trash"></i>' +
        '</button>' +

        '</div>' +
        '</td>' +

        '</tr>';
}


// ---------- FILTRAR Y MOSTRAR TAREAS ----------

let filtroActual = 'todas';

function renderTareas() {

    const todasLasTareas = obtenerTareas();

    const tareasFiltradas = todasLasTareas.filter(function (tarea) {

        if (filtroActual === 'pendientes') {
            return tarea.status === 'PORHACER';
        }

        if (filtroActual === 'completadas') {
            return tarea.status === 'COMPLETADA';
        }

        return true;
    });

    listaTareas.innerHTML = tareasFiltradas.map(crearFilaTarea).join('');
}


// ---------- TO-DO-LIST DEL DÍA ----------

// Obtener la fecha actual en formato YYYY-MM-DD.
function obtenerFechaHoy() {

    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return anio + '-' + mes + '-' + dia;
}


// Dibujar las tareas que tienen fecha de hoy.
function renderTodoDia() {

    const hoy = obtenerFechaHoy();

    const tareasDelDia = obtenerTareas().filter(function (tarea) {
        return tarea.fecha === hoy;
    });

    // Mostrar u ocultar el mensaje cuando no hay tareas.
    mensajeSinTareas.classList.toggle('d-none', tareasDelDia.length > 0);

    // Actualizar contador: completadas / total.
    const completadas = tareasDelDia.filter(function (tarea) {
        return tarea.status === 'COMPLETADA';
    }).length;

    contadorTareasDia.innerHTML =
        completadas + '/' + tareasDelDia.length +
        '<span class="visually-hidden"> tareas completadas</span>';

    // Colores de los círculos según la prioridad.
    const colorCirculo = {
        alta: 'bg-danger',
        media: 'bg-warning',
        baja: 'bg-success'
    };

    // Crear las tareas del To-do-list.
    listaTareasDia.innerHTML = tareasDelDia.map(function (tarea) {

        const titulo = escapeHTML(tarea.titulo);
        const hora = tarea.hora === '' ? '—' : tarea.hora;
        const completada = tarea.status === 'COMPLETADA';

        return `
            <li class="list-group-item d-flex align-items-center flex-nowrap gap-3
                ${completada ? 'bg-body-secondary text-secondary opacity-50' : ''}">

                <input
                    class="form-check-input mt-0"
                    type="checkbox"
                    id="dia-${tarea.id}"
                    data-id="${tarea.id}"
                    ${completada ? 'checked' : ''}
                    aria-label="Completar ${titulo}"
                >

                <span class="small text-secondary flex-shrink-0 text-start"
                    style="width: 3.5rem;">
                    ${hora}
                </span>

                <span class="d-inline-block p-2 rounded-circle ${colorCirculo[tarea.prioridad]}">
                    <span class="visually-hidden">
                        Prioridad ${capitalizar(tarea.prioridad)}
                    </span>
                </span>

                <label class="flex-grow-1 text-truncate mb-0"
                    style="min-width: 0;"
                    for="dia-${tarea.id}">
                    <span class="${completada ? 'text-decoration-line-through' : ''}">
                        ${titulo}
                    </span>
                </label>

                <span class="badge rounded-pill fw-normal ${COLOR_CATEGORIA[tarea.categoria]}">
                    ${capitalizar(tarea.categoria)}
                </span>
            </li>
        `;

    }).join('');
}


// ---------- CAMBIAR ESTADO DE UNA TAREA ----------

function cambiarEstadoTarea(id) {

    // Buscar la tarea en la colección de TaskManager.
    const tarea = taskManager.tasks.find(function (task) {
        return task.id === Number(id);
    });

    if (!tarea) {
        return;
    }

    // Alternar entre pendiente y completada.
    tarea.status = tarea.status === 'PORHACER'
        ? 'COMPLETADA'
        : 'PORHACER';

    // Guardar el estado y actualizar ambas vistas.
    taskManager.save();
    renderTareas();
    renderTodoDia();
}


// ---------- EVENTOS DE LOS CHECKBOXES ----------

// Detectar cambios en la lista general.
listaTareas.addEventListener('change', function (event) {

    if (event.target.matches('input[type="checkbox"]')) {
        cambiarEstadoTarea(event.target.dataset.id);
    }
});


// Detectar cambios en el To-do-list del día.
listaTareasDia.addEventListener('change', function (event) {

    if (event.target.matches('input[type="checkbox"]')) {
        cambiarEstadoTarea(event.target.dataset.id);
    }
});


// ---------- ELIMINAR TAREAS ----------

// Detectar los clics en los botones de eliminar de la tabla.
listaTareas.addEventListener('click', function (event) {

    const botonEliminar = event.target.closest('.delete-button');

    if (!botonEliminar) {
        return;
    }

    // Obtener la fila que contiene la tarea seleccionada.
    const parentTask = botonEliminar.closest('tr');

    if (!parentTask) {
        return;
    }

    // Recuperar el identificador de la tarea.
    const taskId = Number(parentTask.dataset.taskId);

    // Comprobar que el identificador sea válido.
    if (!Number.isInteger(taskId)) {
        return;
    }

    // Eliminar la tarea, guardar y actualizar las vistas.
    taskManager.deleteTask(taskId);
    taskManager.save();

    renderTareas();
    renderTodoDia();

    // Mostrar confirmación.
    alertaTareaEliminada();
});


// ---------- FILTROS DE LA LISTA ----------

function cambiarFiltro(filtro, botonActivo) {

    filtroActual = filtro;

    // Actualizar el botón seleccionado.
    [btnTodas, btnPendientes, btnCompletadas].forEach(function (boton) {
        boton.classList.remove('active');
    });

    botonActivo.classList.add('active');

    renderTareas();
}

btnTodas.addEventListener('click', function () {
    cambiarFiltro('todas', btnTodas);
});

btnPendientes.addEventListener('click', function () {
    cambiarFiltro('pendientes', btnPendientes);
});

btnCompletadas.addEventListener('click', function () {
    cambiarFiltro('completadas', btnCompletadas);
});


// ---------- EVENTO DEL FORMULARIO ----------

formTarea.addEventListener('submit', function (event) {

    // Evitar que el navegador recargue la página.
    event.preventDefault();

    // Obtener y validar los datos.
    const data = getFormData();
    const errores = validFormFieldInput(data);

    limpiarCamposInvalidos();

    // Detener el registro si existen errores.
    if (errores.length > 0) {

        marcarCamposInvalidos(errores);

        const alerta = formularioVacio(data)
            ? alertaFormularioVacio()
            : alertaCamposIncompletos(errores);

        alerta.then(function () {
            document.getElementById(errores[0].idCampo).focus();
        });

        return;
    }

    // Registrar la tarea en TaskManager.
    taskManager.addTask(
        data.titulo.trim(),
        data.notas.trim(),
        data.fecha,
        'PORHACER',
        {
            hora: data.hora,
            categoria: data.categoria,
            prioridad: data.prioridad
        }
    );

    // Guardar las tareas registradas.
    taskManager.save();

    // Mostrar las tareas actualizadas.
    renderTareas();
    renderTodoDia();

    // Dejar el formulario listo para una nueva tarea.
    formTarea.reset();

    // Reiniciar los contadores de caracteres.
    actualizarContador(tituloInput, contadorTitulo, 100);
    actualizarContador(notasInput, contadorNotas, 250);

    // Mostrar confirmación.
    alertaTareaGuardada();

    // Mostrar todas las tareas para que se vea el nuevo registro.
    if (filtroActual !== 'todas') {
        cambiarFiltro('todas', btnTodas);
    }

    // Comprobar las tareas registradas.
    console.log(taskManager.tasks);
});


// ---------- LIMPIAR ERRORES DEL FORMULARIO ----------

// Al corregir un campo se le quita el borde rojo.
formTarea.addEventListener('input', function (event) {
    event.target.classList.remove('is-invalid');
});


// Quitar el mensaje de error visual cuando el usuario cambia su valor.
formTarea.addEventListener('change', function (event) {
    event.target.classList.remove('is-invalid');
});


// ---------- AL CARGAR LA PÁGINA ----------

renderTareas();
renderTodoDia();

actualizarContador(tituloInput, contadorTitulo, 100);
actualizarContador(notasInput, contadorNotas, 250);