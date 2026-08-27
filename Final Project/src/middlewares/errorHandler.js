function errorHandler(err, req, res, next) {
	console.error(`[ERROR] ${req.method} ${req.url} -`, err.message);
	const status = err.statusCode || 500;
	const message =
		status === 500 ? "Terjadi kesalahan pada server" : err.message;
	res.status(status).json({ message });
}

module.exports = errorHandler;
