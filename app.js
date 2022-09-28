import { inquirerMenu, leerInput, listarLugares, pause } from "./helpers/inquirer.js"
import Busquedas from "./models/busquedas.js";
import "colors"
import * as dotenv from 'dotenv'
dotenv.config()



const main = async () => {

    const busquedas = new Busquedas();

    

  let opt = ""
  
    do {
        opt = await inquirerMenu()


        switch (opt) {
            case 1:
                
                //Mostrar mensaje
                    const terminoDeBusqueda = await leerInput("Ciudad: ");
                    
                    //Buscar los lugares
                    const lugares = await busquedas.ciudad(terminoDeBusqueda)
                    
                    //Seleccionar Lugar
                    const id =  await listarLugares(lugares);

                    if (id==="0") continue


                    //guardar en db

                    
                    
                    const lugarSeleccionado = lugares.find(l => l.id === id )
                    
                    busquedas.agregarHistorial(lugarSeleccionado.nombre);

                //Clima

               
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng)
            
             
                //Mostrar Resultados
                console.clear()
                console.log("\nInformacion de la ciudad\n".green)
                console.log("Ciudad:", lugarSeleccionado.nombre )
                console.log("Temperatura:", clima.actual )
                console.log(clima.desc.blue)
                console.log("Mínima:", clima.min)
                console.log("Máxima:", clima.max)
                console.log("Latitud:", lugarSeleccionado.lat)
                console.log("Longitud:", lugarSeleccionado.lng)
            
                break;
        
                case 2:
                    busquedas.historialCapitalizado.forEach((lugar, i) => {
                        const idx =  `${i+1}. `.green;
                        console.log(`${idx} ${lugar}`)
                    })
                    break;

        }

        await pause()
   } while (opt !== 0);
}
main()