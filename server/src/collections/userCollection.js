const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
const collectionName = 'users';

let db;

async function connectToDB() {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('💿 Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function getUserByUsername(username) {
    try {
        const user = await db.collection(collectionName).findOne({ username });
        return user;
    } catch (error) {
        console.error('Error getting user by username:', error);
        throw error;
    }
}

async function insertUser(user) {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        
        const result = await db.collection(collectionName).insertOne(user);
        return result.insertedId;
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}

async function verifyPassword(username, password) {
    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return false; // User not found
        }
        
        return await bcrypt.compare(password, user.password);
    } catch (error) {
        console.error('Error verifying password:', error);
        throw error;
    }
}

module.exports = {
    connectToDB,
    getUserByUsername,
    insertUser,
    verifyPassword
};
