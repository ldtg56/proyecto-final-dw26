const STORAGE_KEY = 'dmela_carrito_compras';

document.addEventListener('DOMContentLoaded', () => {
    actualizarBadgeCarritoHeader();
    inicializarFiltrosNavegacion();
});

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
            tipo: 'combo',
            detalles: {
                'Incluye': descripcionCombo
            }
        });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    actualizarBadgeCarritoHeader();
    alert(`¡${nombre} se agregó correctamente al carrito!`);
}

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
            badge.parentElement.classList.add('animar-rebote');
            setTimeout(() => badge.parentElement.classList.remove('animar-rebote'), 450);
        } else {
            badge.classList.add('d-none');
        }
    }
}

function inicializarFiltrosNavegacion() {
    const paginaActual = window.location.pathname.split('/').pop();
    
    const mapaPaginas = {
        'producto.html': 'chk-tortas', 
        'pedidos.html': 'chk-pedido', 
        'bocaditos.html': 'chk-bocaditos', 
        'combos.html': 'chk-combos', 
        'ofertas.html': 'chk-ofertas'
    };

    const idActivo = mapaPaginas[paginaActual] || 'chk-tortas';
    document.querySelectorAll('.chk-categoria').forEach(chk => chk.checked = false);
    const checkActivo = document.getElementById(idActivo);
    if (checkActivo) checkActivo.checked = true;

    document.querySelectorAll('.chk-categoria').forEach(chk => {
        chk.addEventListener('change', function() {
            if (this.checked) {
                const url = this.getAttribute('data-url');
                
                if (url && url !== '#') {
                    window.location.href = url;
                } else {
                    alert('En construcción 🛠️');
                    this.checked = false;
                    checkActivo.checked = true;
                }
            } else {
                this.checked = true;
            }
        });
    });
    function configurarFiltroExclusivo(idsCheckboxes, tipoFiltro) {
        const cajas = idsCheckboxes.map(id => document.getElementById(id)).filter(caja => caja !== null);
        
        cajas.forEach(cajaActual => {
            cajaActual.addEventListener('change', function() {
                if (this.checked) {
                    cajas.forEach(hermano => {
                        if (hermano !== this) hermano.checked = false;
                    });
                    
                    if (tipoFiltro === 'sabor') filtroSaborActual = this.id.split('-')[1];
                    if (tipoFiltro === 'coleccion') filtroColActual = this.id.split('-')[1];
                } else {
                    if (tipoFiltro === 'sabor') filtroSaborActual = null;
                    if (tipoFiltro === 'coleccion') filtroColActual = null;
                }
                
                cargarProductosPagina(prefijoActual, 1);
            });
        });
    }

    configurarFiltroExclusivo(['sabor-choco', 'sabor-vainilla', 'sabor-fresa'], 'sabor');
    configurarFiltroExclusivo(['col-valentin', 'col-cumple'], 'coleccion');
}