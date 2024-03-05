const Profile = require('../model/Profile');
const User = require('../model/User');
class ProfileController {
    static getAllProfiles = async (req, res) => {
        try {
            const profiles = await Profile.find();
            if (!profiles || profiles.length === 0) return res.status(204).json({ 'message': 'No profiles found' });
            res.json(profiles);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getProfile = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Profile ID required' });

        try {
            const profile = await Profile.findOne({ _id: req.params.id }).exec();
            if (!profile) {
                return res.status(400).json({ 'message': `Profile ID ${req.params.id} not found` });
            }
            res.json(profile);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getProfileByMe = async (req, res) => {
        if (!req?.user_id) return res.status(400).json({ 'message': 'User ID NOT FOUND' });

        try {
            const profile = await Profile.findOne({ user: req.user_id }).exec();
            if (!profile) {
                return res.status(400).json({ 'message': `Your profile not found` });
            }
            res.json(profile);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static createNewProfile = async (req, res) => {
        const { name, phone, address, sex, age } = req.body;
        if (!name || !phone || !address || !sex || !age) return res.status(400).json({ 'message': 'details of profile required' });

        try {
            const duplicateProfile = await Profile.findOne({ user: req.user_id }).exec();
            if (duplicateProfile) return res.status(400).json({ 'message': `Profile of User ID ${req.user_id} already exists` });

            await Profile.create({
                "user": req.user_id,
                "name": name,
                "address": address,
                "phone": phone,
                "sex": sex,
                "age": age
            });
            res.status(201).json({ 'message': `Profile ${name} created` });
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }

    }
    static updateProfile = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Profile ID required' });

        try {
            const profile = await Profile.findOne({ _id: req.params.id }).exec();
            if (!profile) {
                return res.status(400).json({ 'message': `Profile ID ${req.params.id} not found` });
            }
            if (req.body?.name) profile.name = req.body.name;
            if (req.body?.address) profile.address = req.body.address;
            if (req.body?.phone) profile.phone = req.body.phone;
            if (req.body?.sex) profile.sex = req.body.sex;
            if (req.body?.age) profile.age = req.body.age;
            const result = await profile.save();
            res.json(result);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static updateProfileByMe = async (req, res) => {
        if (!req?.user_id) return res.status(400).json({ 'message': 'User ID NOT FOUND' });

        try {
            const profile = await Profile.findOne({ user: req.user_id }).exec();
            if (!profile) {
                return res.status(400).json({ 'message': `Profile of User ID ${req.user_id} not found` });
            }
            if (req.body?.name) profile.name = req.body.name;
            if (req.body?.address) profile.address = req.body.address;
            if (req.body?.phone) profile.phone = req.body.phone;
            if (req.body?.sex) profile.sex = req.body.sex;
            if (req.body?.age) profile.age = req.body.age;
            const result = await profile.save();
            res.json(result);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static deleteProfile = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Profile ID required' });

        try {
            const profile = await Profile.findOne({ _id: req.params.id }).exec();
            if (!profile) {
                return res.status(400).json({ 'message': `Profile ID ${req.params.id} not found` });
            }
            const result = await profile.deleteOne({ _id: req.params.id });
            res.json(result);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getUserByProfileID = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Profile ID required' });

        try {
            const profile = await Profile.findOne({ _id: req.params.id }).exec();
            if (!profile) {
                return res.status(400).json({ 'message': `Profile ID ${req.params.id} not found` });
            }
            const user = await User.findOne({ _id: profile.user }).exec();
            if (!user) return res.status(400).json({ 'message': `User ID ${profile.user} not found` });
            res.json(user);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
    static getProfilesByQuery = async (req, res) => {
        const { name, address, phone, sex, age } = req.query;
        try {
            const query = {};
            if (name) query.name = { $regex: name, $options: 'i' };
            if (address) query.address = { $regex: address, $options: 'i' };
            if (phone) query.phone = { $regex: phone, $options: 'i' };
            if (sex) query.sex = { $eq: sex.toLowerCase() };
            if (age) query.age = { $eq: parseInt(age) };
            const profiles = await Profile.find(query).exec();
            res.json(profiles);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
    }
}

module.exports = ProfileController;