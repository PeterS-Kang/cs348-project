const User = require('../models/Users');

module.exports.login = async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        console.log("Username:",username)
        console.log("Password:", password)
    
        const user = await User.findOne({username: username});
        if (user) {
            if (user.password === password) {
                console.log("Login Success")
                res.status(200).json({
                    loginStatus: true,
                    userID: user._id
                });
            } else {
                console.log("passwords do not match")
                res.status(400).json({
                    loginStatus: false,
                    userID: null
                })
            }
        } else {
            console.log("User not found with username");
            res.status(404).json("User not found with username");
        }
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({message: "Server error"});
    }
}

module.exports.register = async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        console.log(username, password)
        const user = await User.findOne({username: username});
        if (!user) {
            const newUser = new User({
                username: username,
                password: password
            });

            await newUser.save();
            console.log("Register success")
            res.status(200).json({
                userCreated: true,
                userID: newUser._id
            });
        } else {
            console.log("User with username exists");
            res.status(400).json("User with username exists");
        }
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({message: "Server error"});
    }
}