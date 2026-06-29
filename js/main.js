// =================================================================
// MOTOR CATÁLOGO Y HEADER - D'MELA
// =================================================================
const STORAGE_KEY = 'dmela_carrito_compras';

// 1. Función clásica para Tortas
function agregarItemCarrito(id, nombre, precio, imagenUrl) {
    let carritoGuardado = localStorage.getItem(STORAGE_KEY);
    let carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    let indexExistente = carrito.findIndex(item => item.id === id);

    if (indexExistente !== -1) {
        carrito[indexExistente].cantidad += 1;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: Number(precio),
            imagen: imagenUrl,
            cantidad: 1,
            favorito: false,
            tipo: 'torta',
            detalles: {
                'Tamaño': 'Mediano (Estándar)',
                'Masa': 'Chocolate húmedo',
                'Relleno': 'Fudge artesanal',
                'Mensaje': 'Sin mensaje'
            }
        });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    actualizarBadgeCarritoHeader();
    alert(`¡${nombre} se agregó correctamente al carrito!`);
}

// 2. NUEVA Función exclusiva para Combos
function agregarComboCarrito(id, nombre, precio, imagenUrl, descripcionCombo) {
    let carritoGuardado = localStorage.getItem(STORAGE_KEY);
    let carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    let indexExistente = carrito.findIndex(item => item.id === id);

    if (indexExistente !== -1) {
        carrito[indexExistente].cantidad += 1;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: Number(precio),
            imagen: imagenUrl,
            cantidad: 1,
            favorito: false,
            tipo: 'combo', // Identificador clave
            detalles: {
                'Incluye': descripcionCombo
            }
        });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    actualizarBadgeCarritoHeader();
    alert(`¡${nombre} se agregó correctamente al carrito!`);
}

// 3. Actualizador del circulito rojo
function actualizarBadgeCarritoHeader() {
    const memoria = localStorage.getItem(STORAGE_KEY);
    const carrito = memoria ? JSON.parse(memoria) : [];

    let totalUnidades = 0;
    carrito.forEach(item => totalUnidades += item.cantidad);

    const badge = document.getElementById('badgeCarritoHeader');
    if (badge) {
        if (totalUnidades > 0) {
            badge.innerText = totalUnidades;
            badge.classList.remove('d-none');
            // Animación de rebote al agregar
            badge.parentElement.classList.add('animar-rebote');
            setTimeout(() => badge.parentElement.classList.remove('animar-rebote'), 450);
        } else {
            badge.classList.add('d-none');
        }
    }
}

document.addEventListener('DOMContentLoaded', actualizarBadgeCarritoHeader);