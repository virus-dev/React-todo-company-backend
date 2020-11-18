const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('config')
const dbConfig = require('../dbConfig')
const mysql = require('mysql2/promise')

const option = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwtCode')
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(option, async (payload, done) => {
            try {
                const conn = await mysql.createConnection(dbConfig)
                const [user, _] = await conn.execute(`SELECT * FROM floorsbd.users WHERE id = '${payload.id}'`)
                conn.end()
                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            } catch (error) {
                console.log(error)
            }
        })
    )
}