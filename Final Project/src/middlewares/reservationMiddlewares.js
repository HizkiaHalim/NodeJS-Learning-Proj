const JWT = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function reservationMiddleware(req, res, next) {
	const authHeader = req.headers["authorization"];

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ message: "Akses ditolak! Token tidak ditemukan!" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = JWT.verify(token, JWT_SECRET);

		if (decoded.role != "User") {
			return res
				.status(401)
				.json({
					message:
						"Login sebagai dengan akun user untuk dapat mulai reservasi.",
				});
		} else {
			req.user = decoded;
			next();
		}
	} catch (error) {
		return res.status(401).json({ message: "Token tidak valid!" });
	}
}

function adminReservationMiddleware(req, res, next) {
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
				.json({
					message:
						"Login sebagai dengan akun admin untuk dapat melakukan perubahan data reservasi.",
				});
		} else {
			req.user = decoded;
			next();
		}
	} catch (error) {
		return res.status(401).json({ message: "Token tidak valid!" });
	}
}

module.exports = { reservationMiddleware, adminReservationMiddleware };
