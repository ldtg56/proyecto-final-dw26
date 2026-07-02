
document.addEventListener('DOMContentLoaded', () => {
    // 1. Instanciar mapa de Izaga
    var mapIzaga = L.map('mapaIzaga').setView([-6.771446, -79.841525], 16);

    // Cargar la capa visual (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(mapIzaga);

    // Poner el marcador
    L.marker([-6.771446, -79.841525]).addTo(mapIzaga)
        .bindPopup('<b style="color: #8C1616;">D\'Mela</b><br>Sede Manuel María Izaga')
        .openPopup();

    // 2. Instanciar mapa de Los Pinos
    var mapPinos = L.map('mapaPinos').setView([-6.782012, -79.845900], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(mapPinos);

    L.marker([-6.782012, -79.845900]).addTo(mapPinos)
        .bindPopup('<b style="color: #8C1616;">D\'Mela</b><br>Sede Los Pinos')
        .openPopup();
});
