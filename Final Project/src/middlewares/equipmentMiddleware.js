const JWT = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function equipmentMiddleware(req, res, next) {
	const authHeader = req.headers["authorization"];

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ message: "Akses ditolak! Token tidak ditemukan!" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = JWT.verify(token, JWT_SECRET);

		if (decoded.role != "Admin") {
			return res
				.status(401)
				.json({ message: "Anda tidak memiliki akses! Login sebagai Admin untuk mengatur peralatan." });
		} else {
			req.user = decoded;
			next();
		}
	} catch (error) {
		return res.status(401).json({ message: "Token tidak valid!" });
	}
}

module.exports = equipmentMiddleware;
