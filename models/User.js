// Dependency for mongodb control
const mongoose = require('mongoose');
// Assigns the variable UserSchema to the schema for users
const UserSchema = new mongoose.Schema({
  // Each field name is defined first
  // type: establishes the type of variable
  // required: determine when a new record is entered if the field is required
  // unique: require for that field to be unique to other values with the same field name
  // default: establish a default value for the field
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
// Exports the UserSchema model to a global variable called User
module.exports = User = mongoose.model('user', UserSchema);
