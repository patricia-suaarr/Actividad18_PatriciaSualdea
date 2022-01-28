
let slider = document.getElementById("cambioResilucionMapa");
let lineaGrosor = document.getElementById("grosorLinea");
let reiniciar =document.getElementById("reiniciar");

//slider del tamaño del mapa
slider.addEventListener("change", () => {
    inicio();
    document.getElementById("output").value = slider.value;
    Trazar_onclick();
}, false);

//slider del grosor de linea
lineaGrosor.addEventListener("change", () => {
    inicio();
    outpuGrosort.value = lineaGrosor.value;
    Trazar_onclick();
}, false);


//Boton reiniciar
reiniciar.addEventListener("click", () => {
    latitud = 41.6325105208723;
    longitud = -3.6882662944548317;
    listaCalles.innerHTML=""
    navigator.geolocation.getCurrentPosition(pos => {
        latitud = pos.coords.latitude;
        longitud = pos.coords.longitude;
        inicio();
    })
    
    clearInterval( intervaloPosicion)
    inicio()
}, false);

//Reloj
startTime()
function startTime() {
    
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    ap = (hr < 12) ? "<span>AM</span>" : "<span>PM</span>";
    hr = (hr == 0) ? 12 : hr;
    hr = (hr > 12) ? hr - 12 : hr;

    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("tiempo").innerHTML = hr + ":" + min + ":" + sec + " " + ap;
    var time = setTimeout(function(){ startTime() }, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}