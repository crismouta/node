require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const Note = require('./models/Note')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')



app.use(express.json())

/* const app = http.createServer((request, response) => { 
  response.writeHead(200, { 'Content-Type': 'text/plain'})
  response.end('Hola')
}) */

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

//ahora, nuestro json es notes (mongoose)
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  
  Note.findById(id)
    .then(note => {
      if(note) {
        return response.json(note)
      } else {
        response.status(404).end()
      }
  })
  .catch(err => next(err))
})

app.post('/api/notes', (request, response, next) => {
  const note = request.body

  if(!note || !note.content) {
    return response.satatus(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.importante || false
  })

  newNote.save().then(savedNote => {
    response.json(savedNote)
  }).catch(err => next(err))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(err =>next(err))
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndDelete(id)
  .then(() => response.status(204).end())
  .catch(error => next(error))
})


app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
