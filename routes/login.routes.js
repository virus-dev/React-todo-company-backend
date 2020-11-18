const express = require('express')
const Router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dbConfig = require('../dbConfig')
const config = require('config')
const mysql = require('mysql2/promise')

Router.post(
    '/login',
    async (req, res) => {
        try {
            const { login, password } = req.body

            const conn = await mysql.createConnection(dbConfig)

            const [user, _] = await conn.execute(`SELECT * FROM floorsbd.users WHERE login = '${login}'`)

            conn.end()

            if (!user.length) { return res.status(404).json({message: 'Пользователь с таким логином не найден'}) }

            const isMatch = await bcrypt.compare(password, user[0].password)

            if (!isMatch) { return res.status(404).json({ message: 'Неверный пароль' }) }

            const token = jwt.sign(
                { userId: user[0].id },
                config.get('jwtCode'),
                { expiresIn: '1h' }
            )

            res.json({ 
                token: `Bearer ${token}`, 
                userId: user[0].id, 
                status: user[0].status, 
                fullName: `${user[0].secondName} ${user[0].firstName} ${user[0].middleName}`
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

module.exports = Router