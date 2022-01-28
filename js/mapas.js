
let map;
let murallas = new Array();
let latitud = 41.6325105208723;
let longitud = -3.6882662944548317;
let posMurallas = 0;
let marker;
let tzoom = parseInt(slider.value);
let contadorTiempo=0;
let intervaloPosicion=null;

let colortrazado= "#e4fc58"
colorTrazado.value=colortrazado;
//Obtiene la localización actual del sipositivo en latitud, longitud
    navigator.geolocation.getCurrentPosition(pos => {
        latitud = pos.coords.latitude;
        longitud = pos.coords.longitude;  
    }) 
// Paramos el proceso de ejecución de la página para que google map no de error
// de satutación
function delay(n) {
    console.log(n);
    return new Promise(function (resolve) {
        setTimeout(resolve, n);
    });
}

let icono;


icono = {
    url: "./imagenes/bandera.jpg", 
    scaledSize: new google.maps.Size(25, 25), 
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0) 
};
inicio();
function inicio() {
    tzoom = parseInt(slider.value);
    map = new google.maps.Map(
        document.getElementById('map_canvas'), {
        // En el mapa se visualiza el mapa correspondiente a esta latitud, longitud
        center: new google.maps.LatLng(latitud, longitud),
        zoom: tzoom,
        draggableCursor: 'auto', 
        draggingCursor: 'crosshair',
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    // Añade un marcador al mapa
    google.maps.event.addListener(map, 'click', function (event) {
        delay(5)
        
        datolatitud_longitud = event.latLng.toString();
        let posicionActulamapa=datolatitud_longitud.split(",");
      
        latitud = posicionActulamapa[0].substr(1,posicionActulamapa[0].length)
        longitud =  posicionActulamapa[1].substr(1,posicionActulamapa[0].length-1)
      
        murallas.push(datolatitud_longitud);

        icono = {
            url: "./imagenes/bandera.png", 
            scaledSize: new google.maps.Size(tzoom, tzoom), 
            origin: new google.maps.Point(0, 0), 
            anchor: new google.maps.Point(0, 0) 
        };


        marker = new google.maps.Marker({
            position: event.latLng,
            icon: icono,
            map: map,
            nombre: 'Pepino'
        });

        map.setCenter(event.latLng);
        leeDireccion(event.latLng);
    });

    
// Intervalo de detectar nueva posición
intervaloPosicion= setInterval(function(){
    navigator.geolocation.getCurrentPosition(pos => {
        latitud = pos.coords.latitude;
        longitud = pos.coords.longitude;
        let latlng= new google.maps.LatLng(latitud, longitud)
        dibujaMarcador(latlng) 
});
},180000);}


function dibujaMarcador(latlng){
    let llatlng=latlng;
    console.log("ll"+latlng+"  "+llatlng);
    icono = {
        url: "../imagenes/bandera.png",
        scaledSize: new google.maps.Size(tzoom, tzoom),
        origin: new google.maps.Point(0, 0), 
        anchor: new google.maps.Point(0, 0) 
    };


    marker = new google.maps.Marker({
        position:  llatlng,
        icon: icono,
        map: map,
        nombre: 'Pepino'
    });

    map.setCenter(latlng);
    leeDireccion(llatlng);
}



// Obtiene la longitud y la latitud correspondiente al clic y copia los datos en cajas de texto. Tambien obtiene la 
// dirección del lugar donde hacemos clic
function leeDireccion(latlng) {
    geocoder = new google.maps.Geocoder();
    if (latlng != null) {      
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {                   
                    MuestraDireccion(latlng, results[0].formatted_address)
                } else {
                    alert('No results found');
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });
    }
}

function MuestraDireccion(latlng, direccion) {
    let listac=document.getElementById("listaCalles") ;
    let elemento=document.createElement("option")
    elemento.value=latlng;
    elemento.text=direccion;
    listac.appendChild(elemento)
    Trazar_onclick();
}


function Trazar_onclick() {
   
    let tipo_trazo;
     colortrazado = colorTrazado.value;
    let grosorTrazado=grosorLinea.value;
    cRecinto = ""
    let posiciones = "[";
    for (i = 0; i < listaCalles.options.length; i++) {
        
        posiciones = posiciones + "new google.maps.LatLng" + listaCalles[i].value + ",";
        cRecinto = cRecinto + listaCalles[i].value + ",";
    }
    posiciones = posiciones.substr(0, posiciones.length - 1);
    if (tipo_trazo == "recinto") {
        posiciones = posiciones + ",new google.maps.LatLng" +listaCalles[i].value + "]";
    }
    else { posiciones = posiciones + "]"; }
    if (listaCalles.options.length > 0) {
        let polygon = "new google.maps.Polyline({" +
            "path:" + posiciones + "," +
            "strokeColor:'" + colortrazado + "'," +
            "strokeOpacity: 2," +
            "strokeWeight:"+grosorTrazado+"," +
            "geodesic: true})";

        eval(polygon).setMap(map);
    }
    murallas = new Array();
}

function MidemeAreaRecinto() {
    let posiciones = "";
    let distanciaTotal = 0;
    for (i = 0; i < murallas.length; i++) {
        let pi = murallas[i].toString().replace('(', "");
        pi = pi.toString().replace(')', "");
        api = pi.split(",");
        posiciones = posiciones + ", new google.maps.LatLng(" + api[0] + "," + api[1] + ")";
    }
    
    Trazar_onclick();
    pos = 0;
    murallas = new Array();
    posiciones = posiciones.substring(1, posiciones.length);
    posiciones = "[" + posiciones + "]";
    let area = google.maps.geometry.spherical.computeArea(eval(posiciones));
    document.getElementById("cMidemeArea").value = area + " m2.";
}