const route = require('express').Router();
const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registrationValidation, loginValidation } = require('../validation')
// create API
// Register Data
route.post('/register', async (req, res) => {

    // Validation
    const { error } = registrationValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const emailExist = await userModel.findOne({ Email: req.body.Email });
    if (emailExist) return res.status(400).send('email is allready exist');

    // Password bycripting
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.Password, salt)

    const newUser = new userModel({
        Name: req.body.Name,
        Email: req.body.Email,
        Password: hashPassword,
        Phone: req.body.Phone,
        Address: req.body.Address
    })

    try {
        const saveData = await newUser.save();
        res.send(saveData)
    } catch (error) {
        console.log(error);
    }
})

// Login
route.post('/login', async(req, res) => {
    // validation
    const { error } = await loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // is email Exist
    const user = await userModel.findOne({ Email: req.body.Email });
    if (!user) return res.status(400).send('Email or Password is not Valid');

    // Password is Correct
    const validPassword = await bcrypt.compare(req.body.Password, user.Password);
    if (!validPassword) return res.status(400).send('Password is not Valid');

    // create token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.send({token:token,id:user._id,Name:user.Name,Phone:user.Phone,Email:user.Email,Password:user.Password,Address:user.Address})
})


// Get Data
route.get("/show", async (req, res) => {
    try {
        const showData = await userModel.find();
        res.send(showData)
    } catch (error) {
        console.log(error);
    }
})

// Get Data By Id

route.get('/showOne', async (req, res) => {
    let id = req.query.id;
    try {
        const showOne = await userModel.findById(id);
        res.send(showOne)
    } catch (error) {
        console.log(error);
    }
})

// Delete Data

route.delete('/delete', async (req, res) => {
    let id = req.query.id;
    try {
        const deleteData = await userModel.findByIdAndDelete(id)
        res.send('Delete Successfully')
    } catch (error) {
        res.status(400).send(err);
    }
})

// updateData

route.post('/update', async (req, res) => {
    let _id = req.body._id;
    try {
        const updateData = await userModel.findByIdAndUpdate(_id, req.body);
        res.send(updateData);
    } catch (error) {
        console.log(error);
    }
})

// export module
module.exports = route;