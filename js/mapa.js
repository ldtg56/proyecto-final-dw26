function iniciarMapas() {

    const coordIzaga = { lat: -6.7730468377734665, lng: -79.83928991837116 };
    const mapIzaga = new google.maps.Map(document.getElementById("mapaIzaga"), {
        zoom: 16,
        center: coordIzaga
    });

    const markerIzaga = new google.maps.Marker({
        position: coordIzaga,
        map: mapIzaga,
        title: "D'Mela - Sede Manuel María Izaga"
    });
    const infoIzaga = new google.maps.InfoWindow({
        content: '<div style="font-family: sans-serif;"><b style="color: #8C1616; font-size: 1.1em;">D\'Mela</b><br>Sede Manuel María Izaga</div>'
    });
    infoIzaga.open(mapIzaga, markerIzaga);


    const coordPinos = { lat: -6.782395240656596, lng: -79.8395603913857 };
    const mapPinos = new google.maps.Map(document.getElementById("mapaPinos"), {
        zoom: 16,
        center: coordPinos
    });

    const markerPinos = new google.maps.Marker({
        position: coordPinos,
        map: mapPinos,
        title: "D'Mela - Sede Los Pinos"
    });

    const infoPinos = new google.maps.InfoWindow({
        content: '<div style="font-family: sans-serif;"><b style="color: #8C1616; font-size: 1.1em;">D\'Mela</b><br>Sede Los Pinos</div>'
    });
    infoPinos.open(mapPinos, markerPinos);
}