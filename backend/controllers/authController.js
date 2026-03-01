const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        console.log('=== BACKEND LOGIN DEBUG ===');
        console.log('email:', email);
        console.log('role received from frontend:', role);
        console.log('typeof role:', typeof role);

        const user = await User.findOne({ email });
        console.log('user found:', !!user);
        if (user) console.log('user.role in DB:', user.role);

        if (user && (await user.matchPassword(password))) {
            console.log('password matched');
            // If logging in through partner portal and user is currently 'user', upgrade to requested role
            console.log('Checking upgrade: role ===', role, ', user.role ===', user.role);
            if (role === 'dealer' && user.role === 'user') {
                user.role = role;
                user.isProfileComplete = false;
                await user.save();
                console.log(`>>> ROLE UPGRADED TO ${role.toUpperCase()}:`, user.email);
            }

            console.log('Sending response with role:', user.role);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id),
            });
        } else {
            console.log('password mismatch or user not found');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { OAuth2Client } = require('google-auth-library');
const axios = require('axios'); // We need axios to call google userinfo endpoint
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID?.trim());

// @desc    Auth user via Google
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    const { token, role } = req.body; // Take optional role from frontend

    if (!token) {
        return res.status(400).json({ message: 'Google Token is required' });
    }

    try {
        console.log('Verifying Google token...');
        const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const { name, email, picture, sub } = googleResponse.data;
        console.log('Google User Info Received:', email);

        if (!email) {
            return res.status(400).json({ message: 'Google account has no email associated' });
        }

        let user = await User.findOne({ email });

        if (user) {
            console.log('Existing user found:', user.email);
            // If the user is logging in through the partner portal
            // and their current role is 'user', upgrade them to the requested role
            if (role === 'dealer' && user.role === 'user') {
                user.role = role;
                user.isProfileComplete = false;
                await user.save();
                console.log(`User role upgraded to ${role}:`, user.email);
            }

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id),
            });
        } else {
            console.log('Creating new user from Google profile...');
            user = await User.create({
                name,
                email,
                role: role || 'user', // Set role to dealer/fleet if specified
                isProfileComplete: false
            });

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error('Google Auth Error:', error.response?.data || error.message);
        return res.status(401).json({
            message: 'Invalid Google Token or Google API unreachable',
            details: error.response?.data?.error_description || error.message
        });
    }
};

module.exports = { authUser, registerUser, googleAuth };
