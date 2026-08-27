const express = require('express');
const auth = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/auth/register', auth.registerUser);

router.post('/auth/login', auth.loginUser);

router.post('/auth/adm-register', authMiddleware, auth.registerAdmin);

router.post('/auth/adm-login', auth.loginAdmin);

router.post('/auth/change-password', authMiddleware, auth.changePassword);


module.exports = router;