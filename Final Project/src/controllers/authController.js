const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(req, res, next) {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		if (password.length < 6) {
			return res.status(400).json({
				message: "Password harus memiliki minimal 6 karakter!",
			});
		}

		if (!email.includes("@") || !email.includes(".")) {
			return res.status(400).json({
				message: "Gunakan email yang valid!",
			});
		}

		const [existingUser] = await db.execute(
			'SELECT * FROM users WHERE email = ? AND role = "User"',
			[email],
		);
		if (existingUser.length > 0) {
			return res.status(400).json({
				message: "Email sudah digunakan!",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const [result] = await db.query(
			"INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
			[name, email, hashedPassword, "User"],
		);

		res.status(201).json({
			message: "Pengguna baru berhasil didaftarkan",
			data: {
				id: result.insertId,
				name: name,
				email: email,
			},
		});
	} catch (error) {
		next(error);
	}
}

async function loginUser(req, res, next) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		if (!email.includes("@") || !email.includes(".")) {
			return res.status(400).json({
				message: "Gunakan email yang valid!",
			});
		}

		const [user] = await db.execute(
			'SELECT * FROM users WHERE email = ? AND role = "User"',
			[email],
		);
		if (user.length === 0) {
			return res.status(401).json({
				message: "Email atau password salah!",
			});
		}

		const pwMatch = await bcrypt.compare(password, user[0].password);
		if (!pwMatch) {
			return res.status(401).json({
				message: "Email atau password salah!",
			});
		}

		const token = JWT.sign(
			{
				id: user[0].id,
				email: user[0].email,
				role: user[0].role,
				name: user[0].name,
			},
			JWT_SECRET,
			{ expiresIn: "3h" },
		);

		res.status(200).json({
			message: "Login berhasil! Selamat datang " + user[0].name + " !",
			token: token,
		});
	} catch (error) {
		next(error);
	}
}

async function registerAdmin(req, res, next) {
	try {
		const { name, email, password } = req.body;
		const { user } = req.user;

		if (user.role != "Admin") {
			return res.status(401).json({
				message: "Anda tidak memiliki akses!",
			});
		}

		if (!email || !password || !name) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		if (password.length < 6) {
			return res.status(400).json({
				message: "Password harus memiliki minimal 6 karakter!",
			});
		}

		if (!email.includes("@") || !email.includes(".")) {
			return res.status(400).json({
				message: "Gunakan email yang valid!",
			});
		}

		const [existingAdmin] = await db.execute(
			"SELECT * FROM users WHERE email = ? AND role = 'Admin'",
			[email],
		);
		if (existingAdmin.length > 0) {
			return res.status(400).json({
				message: "Email sudah digunakan!",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const [result] = await db.execute(
			"INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
			[name, email, hashedPassword],
		);

		res.status(201).json({
			message: "Admin baru berhasil didaftarkan",
			data: {
				id: result.insertId,
				name: name,
				email: email,
			},
		});
	} catch (error) {
		next(error);
	}
}

async function loginAdmin(req, res, next) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		if (!email.includes("@") || !email.includes(".")) {
			return res.status(400).json({
				message: "Gunakan email yang valid!",
			});
		}

		const [user] = await db.execute(
			'SELECT * FROM users WHERE email = ? AND role = "Admin"',
			[email]
		);
		if (user.length < 0) {
			return res.status(401).json({
				message: "Email atau password salah!",
			});
		}

		const pwMatch = await bcrypt.compare(password, user[0].password);
		if (!pwMatch) {
			return res.status(401).json({
				message: "Email atau password salah!",
			});
		}

		const token = JWT.sign(
			{
				id: user[0].id,
				email: user[0].email,
				role: user[0].role,
				name: user[0].name,
			},
			JWT_SECRET,
			{ expiresIn: "3h" },
		);

		res.status(200).json({
			message: "Login berhasil! Selamat datang admin " + user[0].name + " !",
			token: token,
		});
	} catch (error) {
		next(error);
	}
}

async function changePassword(req, res, next) {
	try {
		const { newPassword } = req.body;
		const user = req.user;

		if (!newPassword) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		const [existingUser] = await db.execute(
			"SELECT * FROM users WHERE email = ? AND id = ?",
			[user.email, user.id],
		);
		if (existingUser.length < 0) {
			return res.status(401).json({
				message: "User tidak terdaftar!",
			});
		}

		const pwMatch = await bcrypt.compare(
			newPassword,
			existingUser[0].password,
		);
		if (!pwMatch) {
			return res.status(401).json({
				message: "Password baru tidak boleh sama dengan password lama",
			});
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		const [result] = await db.execute(
			"UPDATE users SET password = ? WHERE id = ?",
			[hashedPassword, existingUser[0].id],
		);

		res.status(200).json({
			message: "Password berhasil diubah",
		});
	} catch (error) {
		next(error);
	}
}

module.exports = {
	registerUser,
	loginUser,
	registerAdmin,
	loginAdmin,
	changePassword,
};
