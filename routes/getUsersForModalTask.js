const express = require('express')
const Router = express.Router()
const passport = require('passport')
const mysql = require('mysql2/promise')
const dbConfig = require('../dbConfig')

Router.get(
    '/getUsersForModalTask',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        try {
            const conn = await mysql.createConnection(dbConfig)

            const [users, _] = await conn.execute(`SELECT * FROM floorsbd.users WHERE status = 'Пользователь'`)

            conn.end()

            if (!users.length) { res.send(['Нет пользователей']) }

            const usersForModalTask = users.map(el => ({
                userId: el.id,
                fullName: `${el.secondName} ${el.firstName} ${el.middleName }`
            }))

            res.send(usersForModalTask)
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

module.exports = Router