const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose
    = require("passport-local-mongoose");
const dotenv = require("dotenv");
require('dotenv').config();


// mongoose.connect(
// "mongodb://localhost:27017/passport-forget", {
// 	useNewUrlParser: true
// });

const app = express()
const port = process.env.PORT || 3000;

app.use(passport.initialize());

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/register', function (req, res) {
    res.sendFile('register.html', {
        root: __dirname
    });
});

app.get('/changepassword', function (req, res) {
    res.sendFile('changepassword.html', {
        root: __dirname
    });
});

app.post('/register', function (req, res) {
    User.register({
        username: req.body.username
    }, req.body.password, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send('successfully registered')
        }
    });
});

app.post('/changepassword', function (req, res) {
    User.findByUsername(req.body.username, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            user.changePassword(req.body.oldpassword,
                req.body.newpassword, function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send('successfully change password')
                    }
                });
        }
    });
});


// app.listen(3000);
// console.log("running on port 3000");
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB Atlas');
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
        process.exit(1); // Exit the process if unable to connect to the database
    }
};

connectToMongoDB();
// console.log(process.env.DB_CONNECTION);



