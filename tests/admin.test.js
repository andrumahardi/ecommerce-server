const request = require('supertest')
const app = require('../app.js')
const Sequelize = require('sequelize')
const { Op } = Sequelize
const { Admin, sequelize } = require('../models')
const { queryInterface } = sequelize

describe('API route test', () => {
    afterAll((done) => {
        queryInterface.bulkDelete('Admins', {
            where: {
                email: {
                    [Op.not]: `masteradmin@smail.com`
                }
            }
        })
        .then(() => done())
        .catch((err) => done(err))
    })

    test('success register', (done) => {
        request(app)
        .post('/admin/register')
        .send({
            email: `mail@mail.com`,
            password: `12345`
        })
        .end((err, response) => {
            expect(err).toBe(null)
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toBe(`Success added new admin mail@mail.com`)
            expect(response.status).toBe(201)
            done()
        })
    })
    test('success login', (done) => {
        request(app)
        .post('/admin/login')
        .send({
            email: `masteradmin@smail.com`,
            password: `12345`
        })
        .end((err, response) => {
            expect(err).toBe(null)
            expect(response.body).toHaveProperty('token')
            expect(response.status).toBe(200)
            done()
        })
    })
    test('email exist or sequelize validation error register error', (done) => {
        request(app)
        .post('/admin/register')
        .send({
            email: `mail@mail.com`,
            password: `qqqqq`
        })
        .end((err, response) => {
            expect(err).toBe(null)
            expect(response.body).toHaveProperty('message')
            expect(response.body).toHaveProperty(`details`)
            expect(response.status).toBe(400)
            done()
        })
    })
    test('login admin not found', (done) => {
        request(app)
        .post('/admin/login')
        .send({
            email: `ayam@mail.com`,
            password: `12345`
        })
        .end((err, response) => {
            expect(err).toBe(null)
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toBe(`user not found`)
            expect(response.status).toBe(404)
            done()
        })
    })

    test('login password invalid', (done) => {
        request(app)
        .post('/admin/login')
        .send({
            email: `mail@mail.com`,
            password: `1234566`
        })
        .end((err, response) => {
            expect(err).toBe(null)
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toBe(`input invalid`)
            expect(response.status).toBe(400)
            done()
        })
    })
})