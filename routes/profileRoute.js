const express = require('express');
const route = express.Router();
const ProfileController = require('../controllers/profileController');
const verifyJWT = require('../middleware/verifyJWT');

route.get('/api/v1/profiles', verifyJWT, ProfileController.getAllProfiles);
route.get('/api/v1/profiles/me', verifyJWT, ProfileController.getProfileByMe);
route.get('/api/v1/profiles/:id', verifyJWT, ProfileController.getProfile);
route.post('/api/v1/profiles', verifyJWT, ProfileController.createNewProfile);

module.exports = route;