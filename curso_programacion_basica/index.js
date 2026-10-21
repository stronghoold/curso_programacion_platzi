const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.static("public"))
app.use(cors())
app.use(express.json())

const jugadores = []

class Jugador {
  constructor(id) {
    this.id = id
  }

  asignarMokepon(mokepon) {
    this.mokepon = mokepon
  }

  actualizarPosicion(x, y) {
    this.x = x
    this.y = y
  }

  asignarAtaques(ataques) {
    this.ataques = ataques
  }
}

class Mokepon {
  constructor(nombre) {
    this.nombre = nombre
  }
}

// Busca un jugador por id (evita repetir findIndex en cada ruta)
function buscarJugador(id) {
  return jugadores.find((jugador) => jugador.id === id)
}

app.get("/unirse", (req, res) => {
  const id = `${Math.random()}`
  jugadores.push(new Jugador(id))
  res.send(id)
})

app.post("/mokepon/:jugadorId", (req, res) => {
  const jugador = buscarJugador(req.params.jugadorId)
  const nombre = req.body.mokepon || ""

  if (jugador) {
    jugador.asignarMokepon(new Mokepon(nombre))
  }

  res.end()
})

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
  const jugadorId = req.params.jugadorId
  const jugador = buscarJugador(jugadorId)
  const x = req.body.x || 0
  const y = req.body.y || 0

  if (jugador) {
    jugador.actualizarPosicion(x, y)
  }

  const enemigos = jugadores.filter((j) => j.id !== jugadorId)

  res.send({ enemigos })
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugador = buscarJugador(req.params.jugadorId)
  const ataques = req.body.ataques || []

  if (jugador) {
    jugador.asignarAtaques(ataques)
  }

  res.end()
})

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugador = buscarJugador(req.params.jugadorId)

  res.send({
    ataques: (jugador && jugador.ataques) || []
  })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`)
})