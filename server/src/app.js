const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

console.log("🚀 Server is up!");

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.post('/register', (req, res) => {
    // Check if username and password exist in the request body
    const { username, password } = req.body;
    if (!username) {
        return res.status(400).send({
            error: "username is required."
        });
    }

    if (!password || password.length < 8) {
        return res.status(400).send({
            error: "Password is required and must be at least 8 characters long."
        });
    }

    // If username and password exist and meet the criteria, respond with success (status code 200)
    res.status(200).send({
        message: `${username}, You've become a user ;)`,
    });
});

app.listen(process.env.PORT || 8081);
