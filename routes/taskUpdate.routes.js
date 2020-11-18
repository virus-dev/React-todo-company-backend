const express = require('express')
const Router = express.Router()
const passport = require('passport')
const mysql = require('mysql2/promise')
const dbConfig = require('../dbConfig')

Router.post(
    '/updateTaskFromBoss',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        try {
            for (let key in req.body) {
                if (req.body[key] === '') { return res.status(300).json({ message: 'Не введены все данные' }) }
            }

            const {
                description,
                priority,
                responsible,
                status,
                title,
                taskId,
                endingDate
            } = req.body

            const dataNow = 
            `${new Date().getFullYear()}` +
            '-' +
            `${("0" + ((new Date()).getMonth() + 1)).slice(-2)}` +
            '-' +
            `${("0" + ((new Date()).getDate())).slice(-2)}`

            const conn = await mysql.createConnection(dbConfig)

            await conn.execute(`
            UPDATE floorsbd.tasks 
            SET description = '${description}', priority='${priority}', responsible=${responsible}, status='${status}', title='${title}', dateOfUpdate='${dataNow}', endingDate='${endingDate}'
            WHERE id = ${taskId}`)

            conn.end()

            res.send({message: 'Задача обновлена'})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

Router.post(
    '/updateTaskFromResponsive',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        try {
            for (let key in req.body) {
                if (req.body[key] === '') { return res.status(300).json({ message: 'Не введены все данные' }) }
            }

            const {
                status,
                taskId
            } = req.body

            const dataNow = 
            `${new Date().getFullYear()}` +
            '-' +
            `${("0" + ((new Date()).getMonth() + 1)).slice(-2)}` +
            '-' +
            `${("0" + ((new Date()).getDate())).slice(-2)}`

            const conn = await mysql.createConnection(dbConfig)

            await conn.execute(`
            UPDATE floorsbd.tasks 
            SET status='${status.status}', dateOfUpdate='${dataNow}'
            WHERE id = ${taskId}`)

            conn.end()

            res.send({message: 'Задача обновлена'})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

module.exports = Router