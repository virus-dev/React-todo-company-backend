const express = require('express')
const config = require('config')
const bodyParser = require('body-parser')
const conn = require('./dbConnect')
const passport = require('passport')

const app = express()

// async function start() {
//     try {
//         await conn
//         console.log('DataBase ----- OK')
//     } catch (e) {
//         console.log(e)
//     }
// }
// start()

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(bodyParser.json())

app.use('/api/auth', require("./routes/register.routes"))
app.use('/api/auth', require("./routes/login.routes"))

app.use('/api', require("./routes/getUsersForModalTask"))

app.use('/api', require("./routes/addTask.routes"))

app.use('/api', require("./routes/sortTasks.routes"))

app.use('/api', require("./routes/taskUpdate.routes"))


app.listen(config.get('port'), (err) => {
    if (err) {
        throw new Error(err)
    }
    console.log('Server running')
})