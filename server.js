require('dotenv').config()
const express = require('express')
const md5 = require('md5')

const app = express()
app.use(express.static('public'))
app.use(express.json())

const ts = new Date().getTime()
const apikey = process.env.MARVEL_PUBLIC_KEY
const privatekey = process.env.MARVEL_PRIVATE_KEY
const hash = md5(`${ts}${privatekey}${apikey}`)

let characters = []
let currentHero = null
const clients = []

async function fetchCharacters(){
    try{
        const url = `http://gateway.marvel.com/v1/public/characters?limit=100&ts=${ts}&apikey=${apikey}&hash=${hash}`
        const res = await fetch(url)
        const json = await res.json()
        characters = json.data.results.map(c => c.name)
    }catch(err){
        console.error('Error fetching characters', err)
    }
}

function broadcast(msg){
    clients.forEach(res => res.write(`data: ${msg}\n\n`))
    console.log('Broadcast:', msg)
}

function newRound(){
    if(characters.length === 0) return
    currentHero = characters[Math.floor(Math.random() * characters.length)]
    broadcast(`New round! Guess the hero. First letter: ${currentHero[0]}`)
}

app.get('/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()
    clients.push(res)
    req.on('close', () => {
        const idx = clients.indexOf(res)
        if(idx !== -1) clients.splice(idx, 1)
    })
})

app.post('/guess', (req, res) => {
    const { name, guess } = req.body
    if(!currentHero){
        res.json({ error: 'Game not ready' })
        return
    }
    if(guess && guess.toLowerCase() === currentHero.toLowerCase()){
        broadcast(`${name} guessed correctly! The hero was ${currentHero}.`)
        newRound()
    } else {
        broadcast(`${name} guessed ${guess}`)
    }
    res.json({ ok: true })
})

async function start(){
    await fetchCharacters()
    newRound()
    const port = process.env.PORT || 3000
    app.listen(port, () => {
        console.log(`Game server running at http://localhost:${port}`)
    })
}

start()
