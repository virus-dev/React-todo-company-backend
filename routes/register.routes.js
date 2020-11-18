const express = require('express')
const Router = express.Router()
const bcrypt = require('bcryptjs')
const dbConfig = require('../dbConfig')
const mysql = require('mysql2/promise')

Router.post(
    '/register',
    async (req, res) => {
        try {
            const { login, password, firstName, middleName, secondName, status } = req.body

            if (
                login === '' || login === undefined
                || password === '' || password === undefined
                || firstName === '' || firstName === undefined
                || middleName === '' || middleName === undefined
                || secondName === '' || secondName === undefined
                || !( status === 'Пользователь' || status === 'Руководитель' )
            ) {
                return res.status(300).json({ message: 'Не введены все данные' })
            }

            const conn = await mysql.createConnection(dbConfig)

            const [candidate, _] = await conn.execute(`SELECT * FROM floorsbd.users WHERE login = '${login}'`)
            
            if (candidate.length) { return res.status(400).json({message: 'Пользователь с таким логином уже есть'}) }
            
            const hashedPassword = await bcrypt.hash(password, 12)

            await conn.execute
            (`INSERT INTO floorsbd.users (login, password, firstName, middleName, secondName, status) 
            VALUES 
            ('${login}', '${hashedPassword}', '${firstName}', '${middleName}', '${secondName}', '${status}')`)

            conn.end()

            res.status(201).json({ message: 'Пользователь создан' })

        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

module.exports = Router