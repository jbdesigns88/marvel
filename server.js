require('dotenv').config()
const md5 = require('md5')

const ts = new Date().getTime()
const apikey = process.env.MARVEL_PUBLIC_KEY
const privatekey = process.env.MARVEL_PRIVATE_KEY
const hash =  md5(`${ts}${privatekey}${apikey}`)
console.log(`the hash: ${hash} time ${ts} apikey ${apikey} ${privatekey}`)

const uri = 'comics'


const fetchData = async(uri) =>{
    try{

        const url = `http://gateway.marvel.com/v1/public/${uri}?ts=${ts}&apikey=${apikey}&hash=${hash}`
        const results = await fetch(url)
        const response = await results.json()
        console.log(response)
    }
    catch(err){
        console.log(err)
    }
}

fetchData(uri)