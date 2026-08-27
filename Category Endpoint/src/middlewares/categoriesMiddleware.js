function authMiddleware(req, res, next) {
	if (req.method === 'POST') {
		const { name, slug } = req.body;

		if (!name || !slug) {
			return res.status(400).json({
				success: false,
				messages: "Request gagal! Wajib menyertakan parmeter name dan slug",
			});
		}
	}
	else if (req.method === 'PUT'){
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				messages: "Request gagal! Wajib menyertakan parmeter id",
			});
		}
	}
	else if (req.method === 'DELETE'){
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				messages: "Request gagal! Wajib menyertakan parmeter id",
			});
		}
	}
	next();
}

module.exports = authMiddleware;
