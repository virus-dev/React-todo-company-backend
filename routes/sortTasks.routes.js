const express = require('express')
const Router = express.Router()
const passport = require('passport')
const mysql = require('mysql2/promise')
const dbConfig = require('../dbConfig')

const dateYesterday = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() - 1}`)

Router.get(
    '/getAllTasks',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        try {
            const conn = await mysql.createConnection(dbConfig)

            const [tasks, _] = await conn.execute(`SELECT * FROM floorsbd.tasks ORDER BY dateOfUpdate DESC`)

            const [usersName, __] = await conn.execute(`SELECT id, firstName, secondName, middleName FROM floorsbd.users`)

            conn.end()

            const tasksForSend = tasks.map(task => {
                const indexUser = usersName.findIndex(user => task.responsible === user.id)
                const indexBoss = usersName.findIndex(boss => task.creator === boss.id)
                if (indexUser >= 0) {
                    return {
                        ...task,
                        firstNameUser: usersName[indexUser].firstName,
                        secondNameUser: usersName[indexUser].secondName,
                        middleNameUser: usersName[indexUser].middleName,
                        firstNameBoss: usersName[indexBoss].firstName,
                        secondNameBoss: usersName[indexBoss].secondName,
                        middleNameBoss: usersName[indexBoss].middleName,
                    }
                } else {
                    return {
                        ...task,
                        firstNameUser: '',
                        secondNameUser: '',
                        middleNameUser: '',
                        firstNameBoss: usersName[indexBoss].firstName,
                        secondNameBoss: usersName[indexBoss].secondName,
                        middleNameBoss: usersName[indexBoss].middleName,
                    }
                }
            })

            res.send(tasksForSend)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

Router.post(
    '/getTasksUser',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        try {
            const {userId} = req.body

            const conn = await mysql.createConnection(dbConfig)

            const [tasks, _] = await conn.execute(`SELECT * FROM floorsbd.tasks WHERE responsible = ${userId} ORDER BY dateOfUpdate DESC`)

            const [usersName, __] = await conn.execute(`SELECT id, firstName, secondName, middleName FROM floorsbd.users`)

            conn.end()

            // console.log(usersName)
            const tasksForSend = tasks.map(task => {
                const indexUser = usersName.findIndex(user => task.responsible === user.id)
                const indexBoss = usersName.findIndex(boss => task.creator === boss.id)
                return {
                    ...task,
                    firstNameUser: usersName[indexUser].firstName,
                    secondNameUser: usersName[indexUser].secondName,
                    middleNameUser: usersName[indexUser].middleName,
                    firstNameBoss: usersName[indexBoss].firstName,
                    secondNameBoss: usersName[indexBoss].secondName,
                    middleNameBoss: usersName[indexBoss].middleName,
                }
            })

            res.send(tasksForSend)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

Router.post(
    '/getTasksByDate',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        try {
            const {date, userId} = req.body

            const conn = await mysql.createConnection(dbConfig)

            const [tasks, _] = await conn.execute(`SELECT * FROM floorsbd.tasks WHERE responsible = ${userId} ORDER BY dateOfUpdate DESC`)

            const [usersName, __] = await conn.execute(`SELECT id, firstName, secondName, middleName FROM floorsbd.users`)

            conn.end()

            const newTasks = tasks.filter(el => dateYesterday < el.endingDate && el.endingDate < new Date(date))

            const tasksForSend = newTasks.map(task => {
                const indexUser = usersName.findIndex(user => task.responsible === user.id)
                const indexBoss = usersName.findIndex(boss => task.creator === boss.id)
                if (indexUser >= 0) {
                    return {
                        ...task,
                        firstNameUser: usersName[indexUser].firstName,
                        secondNameUser: usersName[indexUser].secondName,
                        middleNameUser: usersName[indexUser].middleName,
                        firstNameBoss: usersName[indexBoss].firstName,
                        secondNameBoss: usersName[indexBoss].secondName,
                        middleNameBoss: usersName[indexBoss].middleName,
                    }
                } else {
                    return {
                        ...task,
                        firstNameUser: '',
                        secondNameUser: '',
                        middleNameUser: '',
                        firstNameBoss: usersName[indexBoss].firstName,
                        secondNameBoss: usersName[indexBoss].secondName,
                        middleNameBoss: usersName[indexBoss].middleName,
                    }
                }
            })

            res.send(tasksForSend)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

module.exports = Router