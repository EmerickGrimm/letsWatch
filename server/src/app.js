const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { connectToDB, getUserByUsername, insertUser, verifyPassword } = require('./collections/userCollection');

require('dotenv').config();

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const generateToken = (userId) => {
  const token = jwt.sign({ userId, createdAt: Date.now() }, process.env.SESSION_SECRET);
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

connectToDB().catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username) {
            return res.status(400).send({
                error: "Username is required."
            });
        }
        if (!password || password.length < 8) {
            return res.status(400).send({
                error: "Password is required and must be at least 8 characters long."
            });
        }

        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(400).send({
                error: "Username already exists."
            });
        }

        const userId = await insertUser({ username, password });

        const token = generateToken(userId);
        res.status(200).send({
            message: `${username}, You've become a user ;)`,
            userId,
            token
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({
            error: "An error occurred while registering the user."
        });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username) {
            return res.status(400).send({
                error: "Username is required."
            });
        }
        if (!password) {
            return res.status(400).send({
                error: "Password is required."
            });
        }

        const existingUser = await getUserByUsername(username);
        if (!existingUser) {
            return res.status(400).send({
                error: "Invalid username or password"
            });
        }

        const isPasswordCorrect = await verifyPassword(username, password);
        if (!isPasswordCorrect) {
            return res.status(400).send({
                error: "Invalid username or password"
            });
        }

        const token = generateToken(existingUser._id);
        res.status(200).send({
            message: `${username}, Welcome in, darling. ;)`,
            userId: existingUser._id,
            token
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send({
            error: "An error occurred while logging in the user."
        });
    }
});

app.get('/protected', (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
  
    try {
      const decoded = verifyToken(token.split(' ')[1]);
      res.send({ message: 'You are authenticated' });
    } catch (error) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
  });

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`🚀 Server up and running on port ${PORT}`);
});
