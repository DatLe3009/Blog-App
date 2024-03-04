const express = require('express');
const route = express.Router();
const ProfileController = require('../controllers/profileController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRole = require('../middleware/verifyRole');

route.get('/api/v1/profiles', verifyJWT, ProfileController.getAllProfiles);
route.get('/api/v1/profiles/me', verifyJWT, ProfileController.getProfileByMe);

route.get('/api/v1/profiles/search', verifyJWT, ProfileController.getProfilesByQuery);

route.get('/api/v1/profiles/:id', verifyJWT, ProfileController.getProfile);
route.post('/api/v1/profiles', verifyJWT, ProfileController.createNewProfile);
route.put('/api/v1/profiles/me', verifyJWT, ProfileController.updateProfileByMe);
route.put('/api/v1/profiles/:id', verifyJWT, verifyRole("admin"), ProfileController.updateProfile);
route.delete('/api/v1/profiles/:id', verifyJWT, verifyRole("admin"), ProfileController.deleteProfile);

route.get('/api/v1/profiles/:id/user', verifyJWT, verifyRole("admin"), ProfileController.getUserByProfileID);

module.exports = route;