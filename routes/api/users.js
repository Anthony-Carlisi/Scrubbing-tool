// Dependency for express to receive json
const express = require('express');
// Dependency for encrypting fields
const bcrypt = require('bcryptjs');
// Dependency for cookie tokens in browers cache
const jwt = require('jsonwebtoken');
// Adding default.json from config for the jwtSecert
const config = require('config');
// Dependency for validating fields
const { check, validationResult } = require('express-validator');
// Pulls the user model for the db
const User = require('../../models/User');

// declare router as an express router for routing to a destination
const router = express.Router();

// @route   Post api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  // Passing a second parameter for validation using express-validator
  [
    // This check to see if a field passed called name is not empty
    check('name', 'Name is required').not().isEmpty(),
    // This checks if email is an actual email
    check('email', 'Please include a valid email').isEmail(),
    // This checks if password has a minimum length of 6
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  // Async the function to wait on the req
  async (req, res) => {
    // Assigns the results of the validation to errors
    const errors = validationResult(req);
    // If there is an error (checks to if is errors is not empty)
    if (!errors.isEmpty()) {
      // Returns the error as an array
      return res.status(400).json({ errors: errors.array() });
    }
    // Deconstructs req.body and pulls out name, email, password
    const { name, email, password } = req.body;

    try {
      // awaits to find if user exists from searching with email
      let user = await User.findOne({ email });
      // See if user exists
      if (user) {
        // if user does exist it will send a response back with user already exists
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
      });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      // Encrypts the password by passing the salt generated and encrypts the plain password text
      user.password = await bcrypt.hash(password, salt);
      // Finally saves the user
      await user.save();

      // Payload consistering of the users ID
      const payload = {
        user: {
          id: user.id,
        },
      };
      // JWT token sends the payload and gets the jwtSecert
      // Then expiration is passed through and the token is returned in the callback
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;
