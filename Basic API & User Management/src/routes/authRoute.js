const express = require('express');

const router = express.Router();

const users = [];

router.get('/users', (req, res) => {
    if (users.length === 0) {
        return res.status(404).json({ message: 'Tidak ada pengguna yang ditemukan!' });
    }

    res.status(200).json(users);
});

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ 
            message: 'Field tidak boleh kosong!' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            message: 'Password harus memiliki minimal 6 karakter!' 
        });
    }

    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ 
            message: 'Gunakan email yang valid!' 
        });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ 
            message: 'Email sudah digunakan!' 
        });
    }

    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);

    res.status(201).json({ 
        message: 'Pengguna baru berhasil didaftarkan', 
        data: { 
            id: newUser.id,
            name : newUser.name, 
            email: newUser.email 
        } 
    });
});

router.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    const getUser = users.find(user => user.id === userId);
    
    if (!getUser) {
        return res.status(404).json({ 
            message: 'Pengguna tidak ditemukan!' 
        });
    }

    res.status(200).json(getUser);
});

module.exports = router;