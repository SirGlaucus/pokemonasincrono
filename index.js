const http = require('http')
const fs = require('fs')

const axios = require('axios')

const getDetallesPokemon = async (urlPokemon) => {
    const data = await axios(urlPokemon)
    return data
}

// Hacer uso de Async/Await para las funciones que consulten los endpoints de la pokeapi.
const getPokemon = async () => {
    return new Promise(async (resolve, reject) => {
        const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150&offset=0')

        const promesas = []
        const datosSeparados = data.results
        datosSeparados.forEach((dataPokemon) => {
            promesas.push(getDetallesPokemon(dataPokemon.url))
        })

        const arrayPokemon = []

        // Usar el Promise.all() para ejecutar y obtener la data de las funciones asíncronas
        // generando un nuevo arreglo con la data a entregar en el siguiente requerimiento.
        Promise.all(promesas).then((resultados) => {
            resultados.forEach((pokemonesEnlistados) => {
                arrayPokemon.push({ img: pokemonesEnlistados.data.sprites.front_default, nombre: pokemonesEnlistados.data.name })
            })
            resolve(arrayPokemon)
        })
    })
}
// Comentario random
http.createServer((req, res) => {
    if (req.url == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        fs.readFile('index.html', 'utf8', (err, html) => {
            res.end(html)
        })
    }
    // Disponibilizar la ruta http://localhost:3000/pokemones que devuelva un JSON con el
    //nombre y la url de una imagen de 150 pokemones
    if (req.url == '/pokemones') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        getPokemon().then((arrayPokemon) => {
            res.write(JSON.stringify(arrayPokemon))
            res.end()
        })
    }
}).listen(3000, () => console.log('Servidor ejecutandose en el puerto 3000'))