const express = require('express')
const app = express()

app.use(express.json())

let notes = [
  {
  "id": 1,
  "content": "Hola",
  "date": "2021-09-08T18:30:30.098Z",
  "important": true
  },
  {
    "id": 2,
    "content": "ComixSix",
    "date": "2021-09-08T18:30:30.098Z",
    "important": true
    }
]

/* const app = http.createServer((request, response) => { 
  response.writeHead(200, { 'Content-Type': 'text/plain'})
  response.end('Hola')
}) */

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if(note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if(!note || !note.content) {
    return response.satatus(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important != 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  
  notes = [...notes, newNote]

  response.status(201).json(newNote)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.filter(note => note.id != id)

  if(note) {
    response.json(note)
  } else {
    response.status(204).end()
  }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
