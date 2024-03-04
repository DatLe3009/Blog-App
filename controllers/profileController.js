const Profile = require('../model/Profile');
const User = require('../model/User');
class ProfileController {
    static getAllProfiles = async (req, res) => {
        const profiles = await Profile.find();
        if (!profiles || profiles.length) return res.status(204).json({ 'message': 'No profiles found' });
        res.json(profiles);
    }
    static getProfile = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Profile ID required' });
        const profile = await Profile.findOne({ _id: req.params.id }).exec();
        if (!profile) {
            return res.status(400).json({ 'message': `Profile ID ${req.params.id} not found` });
        }
        res.json(profile);
    }
    static getProfileByMe = async (req, res) => {
        if (!req?.user_id) return res.status(400).json({ 'message': 'User ID NOT FOUND' });
        const profile = await Profile.findOne({ user: req.user_id }).exec();
        if (!profile) {
            return res.status(400).json({ 'message': `Your profile not found` });
        }
        res.json(profile);
    }
    static createNewProfile = async (req, res) => {
        const { name, phone, address, sex, age } = req.body;
        if (!name || !phone || !address || !sex || !age) return res.status(400).json({ 'message': 'details of profile required' });

        const duplicateProfile = await Profile.findOne({ user: req.user_id }).exec();
        if (duplicateProfile) return res.status(400).json({ 'message': `Profile of User ID ${req.user_id} already exists` });

        try {
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
    }
    static updateProfileByMe = async (req, res) => {
        if (!req?.user_id) return res.status(400).json({ 'message': 'User ID NOT FOUND' });
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
    }
    static deleteProfile = async (req, res) => {
        if (!req?.params?.id) return res.status(400).json({ 'message': 'Profile ID required' });
        const profile = await Profile.findOne({ _id: req.params.id }).exec();
        if (!profile) {
            return res.status(400).json({ 'message': `Profile ID ${req.params.id} not found` });
        }
        const result = await profile.deleteOne({ _id: req.params.id });
        res.json(result);
    }
}

module.exports = ProfileController;