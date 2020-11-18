const express = require('express')
const Router = express.Router()
const passport = require('passport')
const mysql = require('mysql2/promise')
const dbConfig = require('../dbConfig')

Router.post(
    '/addTask',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        try {
            for (let key in req.body) {
                if (req.body[key] === '') { return res.status(300).json({ message: 'Не введены все данные' }) }
            }

            const {
                creationDate, 
                creator, 
                dateOfUpdate, 
                description,
                endingDate,
                priority,
                responsible,
                status,
                title
            } = req.body

            const conn = await mysql.createConnection(dbConfig)

            await conn.execute
            (`INSERT INTO floorsbd.tasks (title, creator, dateOfUpdate, description, endingDate, priority, responsible, status, creationDate) 
            VALUES 
            ('${title}', '${creator}', '${dateOfUpdate}', '${description}', '${endingDate}', '${priority}', '${responsible}', '${status}', '${creationDate}')`)

            conn.end()

            res.status(201).json({message: 'Задача создана'})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

module.exports = Router