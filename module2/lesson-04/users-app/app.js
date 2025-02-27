const bodyParser = require('body-parser')
const path = require('path');
const express = require('express');
const app = express();

const port = 3000;

const mongoose = require('mongoose');
const User = require('./models/User.model'); // loading the User model

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true}));

mongoose
  .connect('mongodb://localhost/userAppDemo')
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(error => console.log(error))

app.get('/', (req, res) => {
    //Get all the users in my database
    User.find()
        .then( allUsers =>{
            res.render('index', { allUsers })
        })
        .catch(error => console.log(error))
    // Send the list of users to my homepage
})

app.get('/signup', (req, res)=>{
    res.render('signup')
})

app.post('/signup', (req, res) =>{
    console.log('req body', req.body)
    // req.body
    // Get the data from the signup form
    const { username, email, password } = req.body; // --> const username = req.body.username
    // Create a new user in our DB
    User.create({ username, email, password })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    // Redirect our user to their profile page
})

app.get('/profile/:username', (req, res) => {
    const { username } = req.params; // const username = req.params.username
    
    User.findOne({ username })
        .then( foundUser => {
            res.render('profile', foundUser)
        })
        .catch(error => console.log(error))
    
})

app.listen(port, ()=> console.log(`Users App is running on port ${port}`))