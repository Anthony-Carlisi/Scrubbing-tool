// Dependency for mongodb control
const mongoose = require('mongoose')
// This allows the ability to add default.json to anysheet 
const config = require('config')
// pulls the confing url from default.json and assigns it to db
const db = config.get('mongoURI')
// Async function to initiate the db connection
const connectDB = async () => {
    // try's to establish a connection with the database
    try {
        // waits for the connection
        await mongoose.connect(db)
        // when the connection is established is logs MongoDB connected...
        console.log('MongoDB Connected...')
        // Catches the error and pushes that error into a variable called catch
    } catch (err) {
        // Console logs the error and drills down to the error message
        console.error(err.message)
        // Exit process with failure
        process.exit(1)
    }
}
// Exports the DB connection globally
module.exports = connectDB