let nombreArchivoElegido = 'Ninguna referencia';
let imagenBase64Elegida = ''; // <-- Nueva variable para guardar la foto comprimida
let precioCotizado = 0.00;

// 1. BASE DE DATOS LOCAL
const baseDeDatos = {
    'Pastel': {
        tamanos: [
            { nombre: 'Mini / Bento Cake (2 a 4 porciones)', precio: 35.00 },
            { nombre: 'Mediano (15 a 20 porciones)', precio: 70.00 },
            { nombre: 'Grande (25 a 30 porciones)', precio: 95.00 }
        ],
        masas: [
            { nombre: 'Vainilla', precio: 0 },
            { nombre: 'Chocolate', precio: 0 },
            { nombre: 'Red Velvet (+ S/ 8.00)', precio: 8.00 }
        ],
        rellenos: [
            { nombre: 'Manjarblanco', precio: 0 },
            { nombre: 'Nocciola Gourmet (+ S/ 6.00)', precio: 6.00 }
        ]
    },
    'Cupcakes': {
        tamanos: [
            { nombre: 'Caja x 6 unidades', precio: 25.00 },
            { nombre: 'Caja x 12 unidades', precio: 45.00 }
        ],
        masas: [
            { nombre: 'Masa Vainilla Tradicional', precio: 0 },
            { nombre: 'Masa Chocolate Belga', precio: 0 }
        ],
        rellenos: [
            { nombre: 'Sin relleno (Solo Frosting)', precio: 0 },
            { nombre: 'Inyección de Fudge (+ S/ 3.00)', precio: 3.00 }
        ]
    },
    'Bocaditos': {
        tamanos: [
            { nombre: 'Medio Ciento (50 unds)', precio: 35.00 },
            { nombre: 'Un Ciento (100 unds)', precio: 65.00 }
        ],
        masas: [
            { nombre: 'Masa Quebrada Salada', precio: 0 },
            { nombre: 'Masa Hojaldre Crujiente', precio: 0 },
            { nombre: 'Variado de Bocaditos Dulces', precio: 0 }
        ],
        rellenos: [
            { nombre: 'Relleno de Queso y Jamón', precio: 0 },
            { nombre: 'Relleno de Pollo y Pecanas (+ S/ 10.00)', precio: 10.00 }
        ]
    },
    'Tarta': {
        tamanos: [
            { nombre: 'Familiar (8-10 porciones)', precio: 45.00 }
        ],
        masas: [
            { nombre: 'Base de Galleta Vainilla', precio: 0 },
            { nombre: 'Base de Galleta Oreo (+ S/ 5.00)', precio: 5.00 }
        ],
        rellenos: [
            { nombre: 'Limón (Lemon Pie)', precio: 0 },
            { nombre: 'Crema de Fresa (+ S/ 5.00)', precio: 5.00 }
        ]
    }
};

// 2. FUNCIONES DE CAJAS Y COTIZACIÓN
function actualizarOpciones() {
    const tipo = document.getElementById('tipoProd').value;
    const datos = baseDeDatos[tipo];
    if (!datos) return;

    llenarCajaOpciones('specTamano', datos.tamanos);
    llenarCajaOpciones('specMasa', datos.masas);
    llenarCajaOpciones('specRelleno', datos.rellenos);
    recalcularCotizacion();
}

function llenarCajaOpciones(idSelect, arreglo) {
    const select = document.getElementById(idSelect);
    select.innerHTML = ''; 
    arreglo.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.nombre;
        opt.text = item.nombre;
        opt.setAttribute('data-precio', item.precio); 
        select.appendChild(opt);
    });
}

function recalcularCotizacion() {
    const cboTamano = document.getElementById('specTamano');
    const cboMasa = document.getElementById('specMasa');
    const cboRelleno = document.getElementById('specRelleno');

    if (!cboTamano.options.length || !cboMasa.options.length || !cboRelleno.options.length) return;

    const pTamano = parseFloat(cboTamano.options[cboTamano.selectedIndex].getAttribute('data-precio')) || 0;
    const pMasa = parseFloat(cboMasa.options[cboMasa.selectedIndex].getAttribute('data-precio')) || 0;
    const pRelleno = parseFloat(cboRelleno.options[cboRelleno.selectedIndex].getAttribute('data-precio')) || 0;

    precioCotizado = pTamano + pMasa + pRelleno;
    document.getElementById('precioCotizadoText').innerText = `S/ ${precioCotizado.toFixed(2)}`;
}

// 3. CAPTURA Y COMPRESIÓN DE IMAGEN 
function capturarNombreArchivo(input) {
    const aviso = document.getElementById('avisoArchivoSubido');
    
    if (input.files && input.files[0]) {
        const archivo = input.files[0];
        
        const ext = archivo.name.split('.').pop().toLowerCase();
        if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
            alert("❌ Formato no permitido. Sube un JPG o PNG.");
            input.value = ''; 
            imagenBase64Elegida = '';
            aviso.classList.add('d-none');
            return;
        }
        
        if (archivo.size > 5242880) {
            alert("❌ El archivo pesa más de 5 MB.");
            input.value = ''; 
            imagenBase64Elegida = '';
            aviso.classList.add('d-none');
            return;
        }

        nombreArchivoElegido = archivo.name;
        aviso.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> Imagen lista: <b>${nombreArchivoElegido}</b>`;
        aviso.classList.remove('d-none');

        // MAGIA: Comprimimos la foto a una miniatura para no reventar la memoria
        const lector = new FileReader();
        lector.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 250; // Tamaño ligero
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // Lo guardamos en formato Base64 para que viaje seguro al carrito
                imagenBase64Elegida = canvas.toDataURL('image/jpeg', 0.8);
            }
            img.src = e.target.result;
        }
        lector.readAsDataURL(archivo);

    } else {
        nombreArchivoElegido = 'Ninguna referencia';
        imagenBase64Elegida = '';
        aviso.classList.add('d-none');
    }
}

// 4. PROCESAR PEDIDO Y ENVIAR AL CARRITO
function procesarPedidoPersonalizado(event) {
    event.preventDefault();

    const tipo = document.getElementById('tipoProd').value;
    const tematica = document.getElementById('tematicaText').value.trim();
    let mensaje = document.getElementById('mensajeText').value.trim();
    const fecha = document.getElementById('fechaReq').value;
    const hora = document.getElementById('horaReq').value;

    if (!tematica) {
        alert("⚠️ Por favor ingresa la temática o colores principales.");
        document.getElementById('tematicaText').focus();
        return false;
    }
    if (!fecha || !hora) {
        alert("⚠️ Por favor selecciona fecha y hora de entrega.");
        return false;
    }

    if (mensaje === "") mensaje = "Sin mensaje";

    // Si el usuario no subió foto, le ponemos el logo de la tienda como relleno
    const imagenFinal = imagenBase64Elegida !== '' ? imagenBase64Elegida : "img/logoD'Mela.jpg";

    const pedido = {
        id: 'pers_' + Date.now(),
        nombre: `Diseño Personalizado: ${tipo}`,
        precio: precioCotizado,
        imagen: imagenFinal, // <--- Aquí inyectamos la foto real
        cantidad: 1,
        favorito: false,
        tipo: 'personalizado',
        detalles: {
            'Tamaño/Cant.': document.getElementById('specTamano').value,
            'Masa/Base': document.getElementById('specMasa').value,
            'Relleno': document.getElementById('specRelleno').value,
            'Temática': tematica,
            'Mensaje': mensaje,
            'Entrega para': `${fecha} / ${hora}`
        }
    };

    let carrito = JSON.parse(localStorage.getItem('dmela_carrito_compras')) || [];
    carrito.push(pedido);
    localStorage.setItem('dmela_carrito_compras', JSON.stringify(carrito));

    alert("🎉 ¡Pedido personalizado añadido al carrito con éxito!");
    window.location.href = 'carrito.html';
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarOpciones();
});