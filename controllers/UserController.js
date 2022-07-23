//const User = require('../models/user')(sequelize, DataTypes);
const models = require('../models/index');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../src/config/auth.json')

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 78300,
    })
}

module.exports = {
    async index(req, res) {

        const users = await models.User.findAll()

        if (users == "" || users == null) {
            return res.status(200).send({ "message": "Nenhum usuário encontrado" })
        }

        return res.status(200).send({ users })
    },

    async store(req, res) {

        const { name, email, password, accountNumber } = req.body;

        const user = await models.User.create({ name, email, password, accountNumber });

        user.password = undefined;

        const token = generateToken({ 'id': user.id })
        return res.status(200).send({
            'status': 1,
            'message': 'Usuário criado com sucesso',
            user,
            token
        })
    },

    async update(req, res) {

        const { name, email, password, accountNumber } = req.body;

        const { user_id } = req.params;

        const user = await models.User.update({
            name, email, password, accountNumber
        }, {
            'where': {
                'id': user_id
            }
        })

        res.status(200).send({
            'status': 1,
            'message': 'Usuário alterado com sucesso',
        })
    },

    async delete(req, res) {
        const { user_id } = req.params;

        const user = await models.User.destroy({
            'where': {
                'id': user_id
            }
        })

        return res.status(200).send({
            'status': 1,
            'message': 'Usuário deletado com sucesso'
        })
    },

    async login(req, res) {
        const { email, password } = req.body;

        const user = await models.User.findOne({ 'where': { email } })

        if (!user) {
            return res.status(400).send({
                'status': 0,
                'message': 'E-mail ou senha inválido'
            })
        }

        if (!bcrypt.compare(password, user.password)) {
            return res.status(400).send({
                'status': 0,
                'message': 'E-mail ou senha inválido'
            })
        }

        user.password = undefined;

        const token = generateToken({ 'id': user.id })
        return res.status(200).send({
            'status': 1,
            'message': 'Usuário logado com sucesso',
            user,
            token
        })
    }

};