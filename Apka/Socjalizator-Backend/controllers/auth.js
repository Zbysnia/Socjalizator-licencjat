const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const Helpers = require('../helpers/helpers');
const dbConfig = require('../config/secret');

module.exports = {
    async CreateUser(req,res){
        const schema = Joi.object().keys({
            username: Joi.string().min(5).max(15).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(5).required()
        });

        const { error, value } = Joi.validate(req.body, schema);
        console.log(value);
        if(error && error.details) {
            return res
            .status(HttpStatus.BAD_REQUEST)
            .json({msg: error.details});
        }

        const userEmail = await User.findOne({email: Helpers.lowerCase(req.body.email)});
        if(userEmail) {
            return res
            .status(HttpStatus.CONFLICT)
            .json({message: 'Email zajęty!'});
        }

        const userName = await User.findOne({username: Helpers.firstUpper(req.body.username)});
        if(userName) {
            return res.status(HttpStatus.CONFLICT).json({message: 'Użytkownik o tej nazwie już istnieje!'});
        }

        return bcrypt.hash(value.password, 10, (err, hash) => {
            if(err){
                return res.status(HttpStatus.BAD_REQUEST).json({message: 'Problem z hashowaniem hasła!'});
            }
            const body = {
                username: Helpers.firstUpper(value.username),
                email: Helpers.lowerCase(value.email),
                password: hash
            };
            User.create(body).then((user)=> {
                const token= jwt.sign({data: user}, dbConfig.secret, {
                   expiresIn: "1h"
                });
                res.cookie('auth',token);
                res.status(HttpStatus.CREATED).json({message: 'Pomyślnie utworzono użytkownika',user,token});
            }).catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: err});
            }); 
        });
    },
    async LoginUser(req,res) {
        if(!req.body.username || !req.body.password) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Wypełnij wszystkie puste pola.'});
        }
        await User.findOne({username: Helpers.firstUpper(req.body.username)}).then(user => {
            if(!user) {
                return res.status(HttpStatus.NOT_FOUND).json({message: 'Nie znaleziono użytkownika'});
            }

            return bcrypt.compare(req.body.password, user.password).then((result) => {
                if(!result) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Błędne hasło.'});
                }
                const token = jwt.sign({data: user},  dbConfig.secret, {
                    expiresIn: '1h'
                });
                res.cookie('auth',token);
                return res.status(HttpStatus.OK).json({message: 'Zalogowano pomyślnie',user,token})
            });
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        })
    }
};