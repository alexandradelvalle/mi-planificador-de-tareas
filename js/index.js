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

// Colores de la paleta del planificador (para SweetAlert)
const COLOR_PRINCIPAL = '#946580';
const COLOR_TEXTO = '#57354D';

// ---------- INSTANCIA DE TASKMANAGER ----------

const taskManager = new TaskManager();

console.log(taskManager.tasks);


// ---------- TAREAS DE EJEMPLO ----------
// Estas cinco tareas son estáticas y sirven para mostrar cómo se organiza la lista.
// No se crean desde el formulario.

const tareas = [
    {
        id: 1,
        titulo: 'Estudiar JavaScript',
        notas: 'Revisar conceptos de arrays y objetos',
        fecha: '2026-11-25',
        hora: '15:00',
        categoria: 'estudio',
        prioridad: 'alta',
        completada: false
    },
    {
        id: 2,
        titulo: 'Comprar ingredientes',
        notas: 'Comprar frutas y verduras para la semana: manzana, pera, brocoli, lechuga, tomate',
        fecha: '2026-11-07',
        hora: '19:00',
        categoria: 'salud',
        prioridad: 'media',
        completada: false
    },
    {
        id: 3,
        titulo: 'Leer un libro',
        notas: 'Continuar con el capítulo 4',
        fecha: '2026-11-08',
        hora: '20:00',
        categoria: 'ocio',
        prioridad: 'baja',
        completada: false
    },
    {
        id: 4,
        titulo: 'Llamar a mamá',
        notas: 'Preguntar cómo estuvo su semana',
        fecha: '2026-11-09',
        hora: '17:00',
        categoria: 'personal',
        prioridad: 'media',
        completada: false
    },
    {
        id: 5,
        titulo: 'Preparar presentación',
        notas: 'Organizar las diapositivas del proyecto',
        fecha: '2026-11-10',
        hora: '08:00',
        categoria: 'trabajo',
        prioridad: 'alta',
        completada: false
    }
];


// ---------- LEER LOS DATOS DEL FORMULARIO ----------
function getFormData() {
    const data = {
        titulo: tituloInput.value,
        notas: notasInput.value,
        fecha: fechaInput.value,
        hora: horaInput.value,
        categoria: categoriaSelect.value,
        prioridad: prioridadSelect.value
    };

    return data;
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


// ---------- VALIDAR DATOS FORMULARIO ----------
// Devuelve una lista de errores. Lista vacía = formulario válido.
function validFormFieldInput(data) {
    const errores = [];

    // trim() quita espacios: "   " cuenta como vacío
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

    // Notas y hora son opcionales: no se validan.

    return errores;
}


// Para cuando el usuario no escribió ni eligió nada
function formularioVacio(data) {
    return Object.values(data).every(function (valor) {
        return valor.trim() === '';
    });
}


// ---------- ALERTAS (SweetAlert2) ----------

// Caso 1: formulario vacío
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

// Caso 2: faltan datos -> lista lo que falta
function alertaCamposIncompletos(errores) {

    const items = errores.map(function (e) {
        return '<li>' + e.mensaje + '</li>';
    }).join('');

    return Swal.fire({
        icon: 'warning',
        title: 'Faltan algunos datos',
        html: '<p class="mb-2">Para guardar la tarea, completa:</p>' +
            '<ul style="text-align:left; display:inline-block; margin:0;">' + items + '</ul>',
        confirmButtonText: 'Entendido',
        confirmButtonColor: COLOR_PRINCIPAL,
        iconColor: COLOR_PRINCIPAL,
        color: COLOR_TEXTO,
        returnFocus: false
    });
}

// Caso 3: tarea guardada -> aviso pequeño que no interrumpe
// Se conserva para una tarea posterior, pero no se utiliza todavía.
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

// Marca en rojo los campos con error
function marcarCamposInvalidos(errores) {
    errores.forEach(function (error) {
        document.getElementById(error.idCampo).classList.add('is-invalid');
    });
}

function limpiarCamposInvalidos() {
    formTarea.querySelectorAll('.is-invalid').forEach(function (campo) {
        campo.classList.remove('is-invalid');
    });
}


// ---------- PINTAR LAS TAREAS EN LA TABLA ----------

// Convierte "2026-11-06" en "06 nov 2026"
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


// Color de la etiqueta según la opción elegida
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


// Pone la primera letra en mayúscula
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}


// Convierte caracteres especiales en texto seguro
function escapeHTML(texto) {
    return texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


// Devuelve el HTML de UNA fila
function crearFilaTarea(tarea) {

    const titulo = escapeHTML(tarea.titulo);
    const notas = escapeHTML(tarea.notas);

    // Notas opcionales
    const celdaNotas = tarea.notas.trim() === ''
        ? '<span class="text-secondary">—</span>'
        : '<span class="d-block text-truncate" title="' +
        notas + '">' + notas + '</span>';

    // Hora opcional
    const celdaHora = tarea.hora === ''
        ? '<span class="text-secondary">—</span>'
        : '<i class="bi bi-clock me-1 text-secondary" aria-hidden="true"></i>' +
        '<time datetime="' + tarea.hora + '">' + tarea.hora + '</time>';

    return '' +
        '<tr class="' +
        (tarea.completada ? 'table-secondary text-secondary opacity-50' : '') +
        '">' +

        '<td>' +
        '<input class="form-check-input" type="checkbox" ' +
        (tarea.completada ? 'checked ' : '') +
        'id="tarea-' + tarea.id + '" ' +
        'data-id="' + tarea.id + '" ' +
        'aria-label="Completar ' + titulo + '">' +

        '<td class="text-start">' +
        '<label for="tarea-' + tarea.id +
        '" class="d-block text-truncate mb-0 fw-normal ' +
        (tarea.completada ? 'text-decoration-line-through' : '') +
        '" title="' + titulo + '">' + titulo + '</label>' +

        '<td class="text-start">' + celdaNotas + '</td>' +

        '<td class="text-start text-nowrap">' +
        '<i class="bi bi-calendar-event me-1 text-secondary" aria-hidden="true"></i>' +
        '<time datetime="' + tarea.fecha + '">' +
        formatearFecha(tarea.fecha) +
        '</time></td>' +

        '<td class="text-start text-nowrap">' + celdaHora + '</td>' +

        '<td class="text-start">' +
        '<span class="badge rounded-pill fw-normal ' +
        COLOR_CATEGORIA[tarea.categoria] + '">' +
        capitalizar(tarea.categoria) +
        '</span></td>' +

        '<td class="text-start">' +
        '<span class="badge rounded-pill fw-normal ' +
        COLOR_PRIORIDAD[tarea.prioridad] + '">' +
        capitalizar(tarea.prioridad) +
        '</span></td>' +

        '<td>' +
        '<div class="d-flex justify-content-center gap-2">' +
        '<button type="button" class="btn btn-sm text-secondary" aria-label="Editar tarea">' +
        '<i class="bi bi-pencil"></i></button>' +
        '<button type="button" class="btn btn-sm text-secondary" aria-label="Eliminar tarea">' +
        '<i class="bi bi-trash"></i></button>' +
        '</div></td>' +

        '</tr>';
}


// Dibuja las cinco tareas de ejemplo en la tabla
function renderTareas() {
    listaTareas.innerHTML = tareas.map(crearFilaTarea).join('');
}


// ---------- TO-DO-LIST DEL DÍA ----------

// Obtener la fecha actual en formato YYYY-MM-DD
function obtenerFechaHoy() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return anio + '-' + mes + '-' + dia;
}


// Dibuja las tareas que tienen fecha de hoy
function renderTodoDia() {

    const hoy = obtenerFechaHoy();

    const tareasDelDia = tareas.filter(function (tarea) {
        return tarea.fecha === hoy;
    });

    // Mostrar u ocultar el mensaje cuando no hay tareas
    mensajeSinTareas.classList.toggle('d-none', tareasDelDia.length > 0);

    // Actualizar contador: completadas / total
    const completadas = tareasDelDia.filter(function (tarea) {
        return tarea.completada;
    }).length;

    contadorTareasDia.innerHTML =
        completadas + '/' + tareasDelDia.length +
        '<span class="visually-hidden"> tareas completadas</span>';

    // Colores de los círculos según la prioridad
    const colorCirculo = {
        alta: 'bg-danger',
        media: 'bg-warning',
        baja: 'bg-success'
    };

    // Crear las filas del To-do-list
    listaTareasDia.innerHTML = tareasDelDia.map(function (tarea) {

        const titulo = escapeHTML(tarea.titulo);

        const hora = tarea.hora === ''
            ? '—'
            : tarea.hora;

        return `
            <li class="list-group-item d-flex align-items-center flex-nowrap gap-3
            ${tarea.completada ? 'bg-body-secondary text-secondary opacity-50' : ''}">

                <input
                    class="form-check-input mt-0"
                    type="checkbox"
                    id="dia-${tarea.id}"
                    data-id="${tarea.id}"
                    ${tarea.completada ? 'checked' : ''}
                    aria-label="Completar ${titulo}"
                >

                <span class="small text-secondary flex-shrink-0 text-start"
                    style="width: 3.5rem;">
                    ${hora || '&nbsp;'}
                </span>

                <span class="d-inline-block p-2 rounded-circle ${colorCirculo[tarea.prioridad]}">
                    <span class="visually-hidden">
                        Prioridad ${capitalizar(tarea.prioridad)}
                    </span>
                </span>

                <label class="flex-grow-1 text-truncate"
                    style="min-width: 0;"
                    for="dia-${tarea.id}">
                    <span class="${tarea.completada ? 'text-decoration-line-through' : ''}">
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

    // Buscar la tarea correspondiente al identificador
    const tarea = tareas.find(function (tarea) {
        return tarea.id === Number(id);
    });

    if (!tarea) {
        return;
    }

    // Alternar entre completada y pendiente
    tarea.completada = !tarea.completada;

    // Actualizar ambas vistas para mantener el mismo estado
    renderTareas();
    renderTodoDia();
}

// ---------- EVENTOS DE LOS CHECKBOXES ----------

// Detectar cambios en la lista general
listaTareas.addEventListener('change', function (event) {

    if (event.target.matches('input[type="checkbox"]')) {
        cambiarEstadoTarea(event.target.dataset.id);
    }

});

// Detectar cambios en el To-do-list del día
listaTareasDia.addEventListener('change', function (event) {

    if (event.target.matches('input[type="checkbox"]')) {
        cambiarEstadoTarea(event.target.dataset.id);
    }

});


// ---------- EVENTOS DEL FORMULARIO ----------

formTarea.addEventListener('submit', function (event) {

    event.preventDefault(); // evita que la página se recargue

    const data = getFormData();
    const errores = validFormFieldInput(data);

    limpiarCamposInvalidos();

    if (errores.length === 0) {

        // CASO 3: los datos son válidos.
        // Se comprueba la información.
        // Todavía no se agrega ninguna tarea a la lista.

        return;
    }

    // CASOS 1 y 2: hay errores
    marcarCamposInvalidos(errores);

    const alerta = formularioVacio(data)
        ? alertaFormularioVacio()
        : alertaCamposIncompletos(errores);

    // Al cerrar la alerta, el cursor va al primer campo con error
    alerta.then(function () {
        document.getElementById(errores[0].idCampo).focus();
    });
});


// Al corregir un campo se le quita el borde rojo
formTarea.addEventListener('input', function (event) {
    event.target.classList.remove('is-invalid');
});

// Quita el mensaje de error visual cuando el usuario cambia su valor
formTarea.addEventListener('change', function (event) {
    event.target.classList.remove('is-invalid');
});


// ---------- AL CARGAR LA PÁGINA ----------

renderTareas();
renderTodoDia();

actualizarContador(tituloInput, contadorTitulo, 100);
actualizarContador(notasInput, contadorNotas, 250);