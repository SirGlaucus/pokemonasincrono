const http = require('http')
const fs = require('fs')

const axios = require('axios')

const getDetallesPokemon = async (urlPokemon) => {
    const data = await axios(urlPokemon)
    return data
}

const getPokemon = async () => {
    return new Promise(async (resolve, reject) => {
        const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150&offset=0')

        const promesas = []
        const datosSeparados = data.results
        datosSeparados.forEach((dataPokemon) => {
            promesas.push(getDetallesPokemon(dataPokemon.url))
        })

        const arrayPokemon = []
        Promise.all(promesas).then((resultados) => {
            resultados.forEach((pokemonesEnlistados) => {
                arrayPokemon.push({ 'img': pokemonesEnlistados.data.sprites.front_default, 'nombre': pokemonesEnlistados.data.name })
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
    if (req.url == '/pokemones') {
        res.writeHead(200, { 'Content-Type': 'text/css' })
        getPokemon().then((arrayP) => {
            res.write(JSON.stringify(arrayP))
            res.end()
        })
    }
}).listen(3000, () => console.log('Servidor ON'))