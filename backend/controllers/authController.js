const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/registerModel')
const generateToken = require('../utils/generateToken')


// @desc    Register new user
// @route   POST /users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {

    const { firstname, lastname, address, country, zip, city,
        telephone, email, number, username, password, isAdmin } = req.body;

    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error('User already exist!')
    }

    const user = await User.create({
        firstname, 
        lastname, 
        address, 
        country, 
        zip, 
        city,
        telephone, 
        email, 
        number, 
        username, 
        password, 
        isAdmin
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            firstname:user.firstname,
            lastname:user.lastname,
            address:user.address,
            country:user.country,
            zip:user.zip,
            city:user.city,
            telephone:user.telephone,
            email:user.email,
            number:user.number,
            username:user.username,
            isAdmin:user.isAdmin,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data!')
    }

})


// @desc    Login user
// @route   POST /users
// @access  Public
const login = asyncHandler( async (req,res) => {
        const {username, password } = req.body

        if(!username || !password){
            res.status(500).json({ message:'Please provide all values!'})
        }

        const user = await User.findOne({username})

        if(!user){
            return res.status(401).json({ message: 'Invalid username or password!' })
        }

        if(user && await bcrypt.compare(password, user.password)){
            let login = await Login.create({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    token: generateToken(user._id)
            })

            return res.status(200).json({ login })

        }else{
            res.status(400)
            return res.json({ message: 'Invalid credentials!' })
        }

})

module.exports = { registerUser, login }

