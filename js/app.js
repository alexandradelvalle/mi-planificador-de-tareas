// ---------- SELECCIONAR ELEMENTOS DEL HTML ----------
const formTarea = document.querySelector('#formTarea');
const tituloInput = document.querySelector('#tituloTarea');
const notasInput = document.querySelector('#notasTarea');
const fechaInput = document.querySelector('#fechaTarea');
const horaInput = document.querySelector('#horaTarea');
const categoriaSelect = document.querySelector('#categoriaTarea');
const prioridadSelect = document.querySelector('#prioridadTarea');
const listaTareas = document.querySelector('#listaTareas'); // el <tbody>
const listaTareasDia = document.querySelector('#listaTareasDia');
const contadorTareasDia = document.querySelector('#contadorTareasDia');
const btnTodas = document.querySelector('#btnTodas');
const btnPendientes = document.querySelector('#btnPendientes');
const btnCompletadas = document.querySelector('#btnCompletadas');
const contadorTitulo = document.querySelector('#contadorTitulo');
const contadorNotas = document.querySelector('#contadorNotas');
const mensajeSinTareas = document.querySelector('#mensajeSinTareas');

// Filtro actual seleccionado
let filtroActual = 'todas';

// Colores de la paleta del planificador (para SweetAlert)
const COLOR_PRINCIPAL = '#946580';
const COLOR_TEXTO = '#57354D';


// ---------- CAPTAR LOS DATOS DE FORMULARIO: Arreglo de tareas ----------
const tareas = [];
let siguienteId = 1;


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

// ---------- CONTADOR DE CARACTERES ----------
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

// ---------- VALIDAR ----------
// Devuelve una lista de errores. Lista vacía = formulario válido.
function validFormFieldInput(data) {
    const errores = [];

    // trim() quita espacios: "   " cuenta como vacío
    if (data.titulo.trim() === '') {
        errores.push({ idCampo: 'tituloTarea', mensaje: 'Escribe un título para la tarea' });
    }
    if (data.fecha === '') {
        errores.push({ idCampo: 'fechaTarea', mensaje: 'Selecciona una fecha' });
    }
    if (data.categoria === '') {
        errores.push({ idCampo: 'categoriaTarea', mensaje: 'Elige una categoría' });
    }
    if (data.prioridad === '') {
        errores.push({ idCampo: 'prioridadTarea', mensaje: 'Elige una prioridad' });
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
    // Los mensajes son textos fijos nuestros (no del usuario), por eso es seguro usar html
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

// Marca en rojo los campos con error (apoyo visual junto a la alerta)
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
// Convierte "2026-11-06" en "06 nov 2026" (sin new Date, para evitar errores de zona horaria)
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function formatearFecha(fechaISO) {
    const partes = fechaISO.split('-'); // [año, mes, día]
    return partes[2] + ' ' + MESES[Number(partes[1]) - 1] + ' ' + partes[0];
}

// Color de la etiqueta según la opción elegida (clases de Bootstrap)
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

// Pone la primera letra en mayúscula: "estudio" -> "Estudio"
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// SEGURIDAD: el usuario puede escribir <, > o comillas. Esto las convierte en texto inofensivo
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

    // Estilo del título cuando la tarea está completada
    const claseTitulo = tarea.completada
        ? 'text-decoration-line-through text-secondary'
        : '';

    // Notas opcionales
    const celdaNotas = tarea.notas.trim() === ''
        ? '<span class="text-secondary">—</span>'
        : '<span class="d-block text-truncate" title="' + notas + '">' + notas + '</span>';

    // Hora opcional
    const celdaHora = tarea.hora === ''
        ? '<span class="text-secondary">—</span>'
        : '<i class="bi bi-clock me-1 text-secondary" aria-hidden="true"></i>' +
        '<time datetime="' + tarea.hora + '">' + tarea.hora + '</time>';

    return '' +
        '<tr>' +

        '<td>' +
        '<input class="form-check-input" type="checkbox" data-id="' + tarea.id +
        '" id="tarea-' + tarea.id + '" ' +
        (tarea.completada ? 'checked' : '') +
        ' aria-label="Completar ' + titulo + '">' +
        '</td>' +

        '<td class="text-start">' +
        '<label for="tarea-' + tarea.id +
        '" class="d-block text-truncate mb-0 fw-normal ' + claseTitulo +
        '" title="' + titulo + '">' + titulo + '</label>' +
        '</td>' +

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

// Dibuja las tareas del arreglo
function renderTareas() {

    let tareasFiltradas = tareas;

    if (filtroActual === 'pendientes') {
        tareasFiltradas = tareas.filter(function (tarea) {
            return !tarea.completada;
        });
    }

    if (filtroActual === 'completadas') {
        tareasFiltradas = tareas.filter(function (tarea) {
            return tarea.completada;
        });
    }

    listaTareas.innerHTML = tareasFiltradas.map(crearFilaTarea).join('');
}

// Obtener la fecha actual en formato YYYY-MM-DD
function obtenerFechaHoy() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return anio + '-' + mes + '-' + dia;
}

// Dibujar las tareas que tienen fecha de hoy
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
        baja: 'bg-success',
    };

    // Crear las filas del To-do-list
    listaTareasDia.innerHTML = tareasDelDia.map(function (tarea) {

        const titulo = escapeHTML(tarea.titulo);

        const hora = tarea.hora === ''
            ? '—'
            : tarea.hora;

        const claseTitulo = tarea.completada
            ? 'text-decoration-line-through text-secondary'
            : '';

        return `
            <li class="list-group-item d-flex align-items-center flex-nowrap gap-3">

                <input
                    class="form-check-input mt-0"
                    type="checkbox"
                    data-id="${tarea.id}"
                    id="dia-${tarea.id}"
                    ${tarea.completada ? 'checked' : ''}
                    aria-label="Completar ${titulo}"
                >

                <span class="small text-secondary flex-shrink-0 text-start" style="width: 3.5rem;">
                    ${hora || '&nbsp;'}
                </span>

                <span class="d-inline-block p-2 rounded-circle ${colorCirculo[tarea.prioridad]}">
                    <span class="visually-hidden">
                        Prioridad ${capitalizar(tarea.prioridad)}
                    </span>
                </span>

                <label class="flex-grow-1 text-truncate ${claseTitulo}" 
                    style="min-width: 0;" for="dia-${tarea.id}">
                    ${titulo}
                </label>

                <span class="badge rounded-pill fw-normal ${COLOR_CATEGORIA[tarea.categoria]}">
                    ${capitalizar(tarea.categoria)}
                </span>

            </li>
        `;

    }).join('');
}

// ---------- AGREGAR UNA NUEVA TAREA ----------
function agregarTarea(data) {

    const tarea = {
        id: siguienteId++,
        titulo: data.titulo.trim(),
        notas: data.notas.trim(),
        fecha: data.fecha,
        hora: data.hora,
        categoria: data.categoria,
        prioridad: data.prioridad,
        completada: false
    };

    // Guardar la tarea en el arreglo
    tareas.push(tarea);

    // Actualizar las dos listas
    renderTareas();
    renderTodoDia();
}

// CHECKS DE LA LISTA GENERAL
listaTareas.addEventListener('change', function (event) {

    if (event.target.matches('input[type="checkbox"]')) {

        const id = Number(event.target.dataset.id);

        const tarea = tareas.find(function (t) {
            return t.id === id;
        });

        if (tarea) {
            tarea.completada = event.target.checked;

            renderTareas();
            renderTodoDia();
        }
    }
});

// CHECKS DEL TO-DO-LIST
listaTareasDia.addEventListener('change', function (event) {

    if (event.target.matches('input[type="checkbox"]')) {

        const id = Number(event.target.dataset.id);

        const tarea = tareas.find(function (t) {
            return t.id === id;
        });

        if (tarea) {
            tarea.completada = event.target.checked;

            renderTareas();
            renderTodoDia();
        }
    }
});

// ---------- EVENTOS ----------
formTarea.addEventListener('submit', function (event) {
    event.preventDefault(); // evita que la página se recargue

    const data = getFormData();
    const errores = validFormFieldInput(data);

    limpiarCamposInvalidos();

    if (errores.length === 0) {
        // CASO 3: válido -> se pinta la tarea y se limpia el formulario
        agregarTarea(data);
        formTarea.reset();
        alertaTareaGuardada();
        return;
    }

    // CASOS 1 y 2: hay errores
    marcarCamposInvalidos(errores);

    const alerta = formularioVacio(data)
        ? alertaFormularioVacio()          // caso 1
        : alertaCamposIncompletos(errores); // caso 2

    // Al cerrar la alerta, el cursor va al primer campo con error
    alerta.then(function () {
        document.getElementById(errores[0].idCampo).focus();
    });
});

// Al corregir un campo se le quita el borde rojo
formTarea.addEventListener('input', function (event) {
    event.target.classList.remove('is-invalid');
});
// Quita el mensaje de error visual de un campo cuando el usuario cambia su valor
formTarea.addEventListener('change', function (event) {
    event.target.classList.remove('is-invalid');
});

// ---------- FILTROS ----------
// FILTRO: TODAS
btnTodas.addEventListener('click', function () {
    filtroActual = 'todas';

    btnTodas.classList.add('active');
    btnPendientes.classList.remove('active');
    btnCompletadas.classList.remove('active');

    renderTareas();
});

// FILTRO: PENDIENTES
btnPendientes.addEventListener('click', function () {
    filtroActual = 'pendientes';

    btnTodas.classList.remove('active');
    btnPendientes.classList.add('active');
    btnCompletadas.classList.remove('active');

    renderTareas();
});

// FILTRO: COMPLETADAS
btnCompletadas.addEventListener('click', function () {
    filtroActual = 'completadas';

    btnTodas.classList.remove('active');
    btnPendientes.classList.remove('active');
    btnCompletadas.classList.add('active');

    renderTareas();
});


// ---------- AL CARGAR LA PÁGINA ----------
renderTareas();
renderTodoDia();
actualizarContador(tituloInput, contadorTitulo, 100);
actualizarContador(notasInput, contadorNotas, 250);
