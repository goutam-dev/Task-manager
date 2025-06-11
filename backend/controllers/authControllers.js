const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { 
        expiresIn: "7d"  // Fixed typo and changed to 7 days
    });
};

// @desc  Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        let role = "member";
        if(adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) role = "admin"

         // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword , profileImageUrl, role });

       

        // Save user
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl : user.profileImageUrl,
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Get user profile
// @route GET /api/auth/profile
// @access Private
const getUserProfile = async (req, res) => {
    try {
        // req.user is set by auth middleware
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  Update user profile
// @route PUT /api/auth/profile
// @access Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.profileImageUrl = req.body.profileImageUrl || user.profileImageUrl;

        // Update password if provided
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImageUrl: updatedUser.profileImageUrl,
            token : generateToken(user._id)
        });
    } catch (err) {
        console.error(err);
        
        // Handle duplicate email error
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already in use" });
        }
        
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };