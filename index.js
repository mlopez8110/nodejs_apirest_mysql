const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// MySQL Code goes here

// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Escuchando puerto ${port}`))


const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'bdapirest'
})

// Mostrar tabla peliculas
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('conectado al id ' + connection.threadId)
        connection.query('SELECT * from peliculas', (err, rows) => {
            connection.release() 
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('Los datos de la tabla peliculas son: \n', rows)
        })
    })
})

//consulta id

app.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM peliculas WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('El dato de consulta de la tabla pelicula es: \n', rows)
        })
    })
});


// Agregar registro tabla peliculas
app.post('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body

        connection.query('INSERT INTO peliculas SET ?', params , (err, rows) => {
            connection.release()

            if(!err) {
                res.send(`La pelicula: ${params.pelicula} ha sido agregado.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})


// Actualizar registro de la tabla peliculas
app.put('', (req, res) => {

    pool.getConnection((err, connection) => { 
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { id, pelicula, genero, duracion } = req.body

        connection.query('UPDATE peliculas SET pelicula = ?, genero = ?, duracion = ? WHERE id = ?', [pelicula, genero, duracion, id] , (err, rows) => {
            connection.release()

            if(!err) {
                res.send(`Pelicula con el nombre: ${pelicula} ha sido actualizado.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})

//Eliminar registro tabla peliculas
app.delete('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from peliculas WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err) {
                res.send(`El registro de la tabla peliculas con id: ${[req.params.id]} ha sido eliminado.`)
            } else {
                console.log(err)
            }

        })
    })
})


