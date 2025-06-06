const name = prompt('Enter your name') || 'Player'
const messages = document.getElementById('messages')
const guessInput = document.getElementById('guess')

const source = new EventSource('/stream')
source.onmessage = (e) => {
    const li = document.createElement('li')
    li.textContent = e.data
    messages.appendChild(li)
}

function sendGuess(){
    const guess = guessInput.value
    if(!guess) return
    fetch('/guess', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, guess })
    })
    guessInput.value = ''
}
