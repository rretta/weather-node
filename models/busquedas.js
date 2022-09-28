
import fs from "fs"
import axios from "axios";


export default class Busquedas {

historial = [];
dbPath= "./db/database.json"
constructor () {
    //TODO: leer db si existe
    this.leerDB()
    
}

get historialCapitalizado(){

   
    return this.historial.map( lugar =>{
        let palabras = lugar.split(" ");
        palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
        return palabras.join(" ")
    })
}

get paramsMapbox(){
    return{
         
            "proximity": "ip",
            "access_token": process.env.MAPBOX_KEY,
            "limit":5,
            "lenguage":"es",
            "type": "place%2Cpostcode%2Caddress"

        
    }
}

async ciudad ( lugar = ""){


try {
    const  instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox
    })
    const resp = await instance.get();
    //peticion http
    // console.log("ciudad", lugar)
    //const resp = await axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/cordoba.json?proximity=ip&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1IjoiZXplbWF0IiwiYSI6ImNsOGt0anZ6ZDAxNTUzdW10djJnNW50NHkifQ.li61oJ64N_Z3wG6N0rGdYg")
    
    return resp.data.features.map(lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],

    }))
} 
    catch (error) {
    return []
}



}


async climaLugar(lat,lon) {
    try {
        //crear instancia
        const  instance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_KEY}&units=metric&lang=es`,
            params: this.paramsMapbox
        })
        const resp = await instance.get();
        //respuesta


        
        return {
            actual: resp.data.main.temp,
            desc: resp.data.weather[0].description,
            min: resp.data.main.temp_min,
            max: resp.data.main.temp_max,
        }
    } catch (error) {
        console.log(error)
    }
}



agregarHistorial( lugar = ""){
    //TODO: prevenir duplicados
    if (this.historial.includes(lugar.toLocaleLowerCase())){
        return
    }

    this.historial = this.historial.splice(0,5);
    this.historial.unshift(lugar.toLocaleLowerCase());
    this.guardarDB()
    //Grabar en DB
}

guardarDB(){
    const payload ={
        historial: this.historial
    }
    fs.writeFileSync( this.dbPath, JSON.stringify(payload))
}

leerDB(){

    if(!fs.existsSync(this.dbPath)){
        return ;
    }

    const info = fs.readFileSync(this.dbPath, {encoding:"utf-8"});
    const data = JSON.parse(info)
    
    this.historial = data.historial;
    // Debe existir....

    // C
}

}