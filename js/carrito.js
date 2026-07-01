const STORAGE_KEY = 'dmela_carrito_compras';

let descuentoPorcentaje = 0;
let descuentoFijo = 0;
let cuponNombreActivo = '';

function obtenerCarrito() {
    const memoria = localStorage.getItem(STORAGE_KEY);
    return memoria ? JSON.parse(memoria) : [];
}

function guardarCarrito(datos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    renderizarPantalla();
}

function renderizarPantalla() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById('contenedorProductosCarrito');
    const btnPago = document.getElementById('btnContinuarPago');

    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="card border-0 rounded-3 shadow-sm p-5 text-center bg-white my-2">
                <i class="fa-solid fa-cart-shopping fs-1 text-secondary mb-3 opacity-25 icono-respirando"></i>
                <h5 class="fw-bold text-dark">Tu carrito está vacío</h5>
                <p class="text-muted small mb-4">Aún no has elegido ninguna dulzura de nuestra tienda.</p>
                <a href="producto.html" class="btn text-white fw-bold px-4 py-2 mx-auto rounded-2" style="background-color: #8C1616; max-width: 220px;">Ir al Catálogo</a>
            </div>
        `;
        if (btnPago) {
            btnPago.classList.add('disabled');
            btnPago.style.pointerEvents = 'none';
            btnPago.style.opacity = '0.5';
        }
        actualizarTextosResumen(0, 0);
        return;
    }

    if (btnPago) {
        btnPago.classList.remove('disabled');
        btnPago.style.pointerEvents = 'auto';
        btnPago.style.opacity = '1';
    }

    let sumaSubtotal = 0;
    let conteoUnidades = 0;
    let sumaPuntos = 0; // NUEVA VARIABLE PARA LOS PUNTOS

    carrito.forEach((prod) => {
        const subtotalProd = prod.precio * prod.cantidad;
        // Calculamos los puntos (Ej: 1 punto por cada sol gastado, redondeado hacia abajo)
        const puntosProd = Math.floor(prod.precio) * prod.cantidad;

        sumaSubtotal += subtotalProd;
        conteoUnidades += prod.cantidad;
        sumaPuntos += puntosProd;

        // ============================================================
        // LÓGICA DIFERENCIADA PARA PEDIDOS PERSONALIZADOS Y CATÁLOGO
        // ============================================================
        let filasDetalle = '';
        if (prod.detalles) {
            if (prod.tipo === 'personalizado') {
                // EXCLUSIVO PERSONALIZADOS: Grilla 2 columnas fluida y limpia
                const itemsGrid = Object.entries(prod.detalles).map(([clave, valor]) =>
                    `<div class="col-12 col-md-6 mb-2 d-flex flex-wrap align-items-baseline gap-1">
                        <strong class="fw-bold text-dark text-nowrap" style="font-size: 0.9rem;">${clave}:</strong> 
                        <span class="text-secondary" style="word-break: break-word; font-size: 0.88rem;">${valor}</span>
                    </div>`
                ).join('');

                filasDetalle = `<div class="row gx-3 gy-1 w-100 m-0 pt-2 pb-1">${itemsGrid}</div>`;
            } else {
                // TODOS LOS DEMÁS PRODUCTOS: Formato clásico vertical de siempre
                filasDetalle = Object.entries(prod.detalles).map(([clave, valor]) =>
                    `<div class="mb-2">
                        <strong class="fw-bold text-dark">${clave}:</strong> 
                        <span class="text-secondary">${valor}</span>
                    </div>`
                ).join('');
            }
        }

        const plantillaTarjeta = `
            <div id="tarjeta_${prod.id}" class="card border-0 rounded-3 shadow-sm p-3 bg-white mb-2 tarjeta-animada">
                <div class="row g-3 align-items-center">
                    
                    <div class="col-12 col-sm-4 text-center">
                        <img src="${prod.imagen}" class="img-fluid rounded shadow-sm border" style="max-height: 140px; width: 100%; object-fit: contain; background-color: #f8f9fa;">
                    </div>
                    
                    <div class="col-12 col-sm-8">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="fw-bold mb-0 text-dark fs-5">${prod.nombre}</h6>
                            <div class="d-flex align-items-center gap-2 text-secondary">
                                <i onclick="alternarFavorito('${prod.id}')" class="fa-${prod.favorito ? 'solid text-danger' : 'regular'} fa-heart fs-5" role="button" style="cursor: pointer;"></i>
                                <span class="text-dark fw-bolder fs-5 user-select-none">|</span>
                                <i onclick="removerProducto('${prod.id}')" class="fa-regular fa-trash-can fs-5" role="button" style="cursor: pointer;"></i>
                            </div>
                        </div>
                        
                        <div class="text-dark mb-3" style="font-size: 0.9rem;">
                            ${filasDetalle}
                        </div>
                        
                        <div class="d-flex flex-column align-items-start gap-2 pt-3 border-top">
                            <div class="d-flex align-items-center gap-2">
                                <strong class="fw-bold" style="font-size: 0.95rem;">Cantidad:</strong>
                                <div class="btn-group btn-group-sm">
                                    <button onclick="modificarCantidad('${prod.id}', -1)" class="btn text-white py-0 px-2 fw-bold" style="background-color: #8C1616;">-</button>
                                    <span class="px-3 fw-bold bg-light d-flex align-items-center border text-dark">${prod.cantidad}</span>
                                    <button onclick="modificarCantidad('${prod.id}', 1)" class="btn text-white py-0 px-2 fw-bold" style="background-color: #8C1616;">+</button>
                                </div>
                                <span class="text-muted" style="font-size: 0.8rem;">(S/ ${prod.precio.toFixed(2)} c/u)</span>
                            </div>
                            <div class="fw-bold fs-5 mt-1" style="color: #8C1616;">
                                Subtotal: S/ ${subtotalProd.toFixed(2)}
                            </div>
                            <div class="text-success fw-bold mt-1" style="font-size: 0.85rem;">
                                <i class="fa-solid fa-star"></i> Otorga ${puntosProd} puntos
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', plantillaTarjeta);
    });

    actualizarTextosResumen(conteoUnidades, sumaSubtotal, sumaPuntos);
}

function modificarCantidad(id, cambio) {
    const carrito = obtenerCarrito();
    const pos = carrito.findIndex(p => p.id === id);
    if (pos !== -1) {
        carrito[pos].cantidad += cambio;
        if (carrito[pos].cantidad <= 0) carrito.splice(pos, 1);
        guardarCarrito(carrito);
    }
}

function removerProducto(id) {
    const tarjetaVisual = document.getElementById(`tarjeta_${id}`);

    if (tarjetaVisual) {
        // 1. Le disparas la animación de salida
        tarjetaVisual.classList.add('tarjeta-saliendo');

        // 2. Esperas a que el CSS termine de desvanecerla para matarla en la memoria
        setTimeout(() => {
            const carritoLimpiado = obtenerCarrito().filter(p => p.id !== id);
            guardarCarrito(carritoLimpiado);
        }, 280);
    } else {
        guardarCarrito(obtenerCarrito().filter(p => p.id !== id));
    }
}

function alternarFavorito(id) {
    const carrito = obtenerCarrito();
    const pos = carrito.findIndex(p => p.id === id);
    if (pos !== -1) {
        carrito[pos].favorito = !carrito[pos].favorito;
        guardarCarrito(carrito);
    }
}

function agregarExtraSimple(nombre, precio, img) {
    const carrito = obtenerCarrito();
    const idGen = 'extra_' + nombre.toLowerCase().replace(/\s+/g, '');
    const pos = carrito.findIndex(p => p.id === idGen);

    if (pos !== -1) {
        carrito[pos].cantidad += 1;
    } else {
        carrito.push({
            id: idGen,
            nombre: nombre,
            precio: precio,
            imagen: img,
            cantidad: 1,
            favorito: false,
            tipo: 'extra' // Identificador para que mantenga formato simple
        });
    }
    guardarCarrito(carrito);
}

// =================================================================
// MOTOR DE DESCUENTOS Y MATEMÁTICA (VERSIÓN SEGURA)
// =================================================================
function aplicarCupon() {
    const input = document.getElementById('inputCupon');
    const codigo = input.value.trim().toUpperCase();

    // NUEVO: Leer la bóveda de cupones válidos generados en el dashboard
    let cuponesActivos = JSON.parse(localStorage.getItem('dmela_cupones_activos')) || [];

    // Buscar si el código que escribió el usuario existe en nuestra bóveda
    let cuponEncontrado = cuponesActivos.find(c => c.codigo === codigo);

    if (codigo === 'DMELA10') {
        descuentoPorcentaje = 0.10; // 10%
        descuentoFijo = 0;
        cuponNombreActivo = 'Cupón DMELA10 (10%)';
        alert('¡Cupón DMELA10 aplicado con éxito!');

    } else if (codigo === 'FESTEJO20') {
        descuentoPorcentaje = 0;
        descuentoFijo = 20.00; // S/ 20 soles directos
        cuponNombreActivo = 'Cupón FESTEJO20 (-S/20)';
        alert('¡Cupón FESTEJO20 aplicado con éxito!');

    } else if (cuponEncontrado) {
        // NUEVA LÓGICA: Si el código existe en la bóveda, aplicamos su valor
        descuentoPorcentaje = 0;
        descuentoFijo = cuponEncontrado.valor;
        cuponNombreActivo = `Cupón de Canje (-S/ ${descuentoFijo.toFixed(2)})`;

        // Guardamos una bandera para saber qué código quemar luego de pagar
        localStorage.setItem('dmela_cupon_en_uso', codigo);

        alert(`¡Cupón de puntos verificado! Tienes un descuento de S/ ${descuentoFijo.toFixed(2)}`);

    } else if (codigo.startsWith('PUNTOS-')) {
        // Si empieza con PUNTOS pero no está en la bóveda, es falso o ya se usó
        alert('Este código de puntos no existe, ya fue usado o está mal escrito.');
        return;
    } else {
        alert('Cupón no válido o expirado.');
        return;
    }

    renderizarPantalla();
}

function actualizarTextosResumen(unidades, subtotal, puntosTotales = 0) {
    document.getElementById('resumenCantidadText').innerText = `${unidades} ${unidades === 1 ? 'Producto' : 'Productos'}`;
    document.getElementById('resumenSubtotalText').innerText = `S/ ${subtotal.toFixed(2)}`;

    // Lógica de descuentos restaurada
    let montoDescuentoCalculado = (subtotal * descuentoPorcentaje) + descuentoFijo;
    if (montoDescuentoCalculado > subtotal) montoDescuentoCalculado = subtotal; // Evitar totales negativos

    const filaDesc = document.getElementById('filaDescuento');
    if (filaDesc) {
        if (montoDescuentoCalculado > 0 && unidades > 0) {
            filaDesc.classList.remove('d-none');
            document.getElementById('nombreCuponText').innerText = cuponNombreActivo;
            document.getElementById('montoDescuentoText').innerText = `- S/ ${montoDescuentoCalculado.toFixed(2)}`;
        } else {
            filaDesc.classList.add('d-none');
        }
    }

    const subtotalFinal = subtotal - montoDescuentoCalculado;
    const total = unidades > 0 ? subtotalFinal : 0.00;

    document.getElementById('resumenTotalText').innerText = `S/ ${total.toFixed(2)}`;

    // Imprimimos los puntos totales en el HTML
    const elementoPuntos = document.getElementById('resumenPuntosText');
    if (elementoPuntos) {
        elementoPuntos.innerText = `+ ${puntosTotales} pts`;
    }
}

// =================================================================
// INICIALIZADOR BLINDADO AL CARGAR LA PÁGINA
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    renderizarPantalla();

    // Reparación de fuerza bruta para el carrusel de Bootstrap
    const elemCarrusel = document.getElementById('carruselExtras');
    if (elemCarrusel && typeof bootstrap !== 'undefined') {
        new bootstrap.Carousel(elemCarrusel, {
            interval: false,
            touch: true
        });
    }
});

function validarCheckout(event) {
    const checkTerminos = document.getElementById('checkTerminos');
    const checkPrivacidad = document.getElementById('checkPrivacidad');

    if (!checkTerminos.checked || !checkPrivacidad.checked) {
        event.preventDefault();
        alert('Debe marcar las casillas de "Términos y Condiciones" y "Política de Privacidad" para poder procesar tu pago.');
        return false;
    }

    // Extraemos y guardamos los puntos
    const textoPuntos = document.getElementById('resumenPuntosText').innerText;
    const puntosPendientes = parseInt(textoPuntos.replace(/[^0-9]/g, '')) || 0;
    localStorage.setItem('dmela_puntos_pendientes', puntosPendientes);

    // =========================================================
    // NUEVO: Extraer y guardar el descuento para el Checkout
    // =========================================================
    const textoDescuento = document.getElementById('montoDescuentoText');
    const filaDescuento = document.getElementById('filaDescuento');
    let descuentoTotal = 0;

    // Si el texto de descuento existe y no está oculto, lo capturamos
    if (textoDescuento && filaDescuento && !filaDescuento.classList.contains('d-none')) {
        descuentoTotal = parseFloat(textoDescuento.innerText.replace(/[^0-9.]/g, '')) || 0;
    }
    localStorage.setItem('dmela_descuento_pendiente', descuentoTotal);

    return true;
}