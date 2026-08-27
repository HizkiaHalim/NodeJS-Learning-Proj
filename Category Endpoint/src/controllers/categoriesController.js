const db = require("../config/db");

async function getAllCategories(req, res, next) {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const offset = (page - 1) * limit;

		const [allData] = await db.execute(
			"SELECT * FROM categories LIMIT ? OFFSET ?",
			[limit, offset],
		);

		if (allData.length === 0) {
			res.status(404).json({
				success: false,
				messages: "Category tidak ditemukan",
				data: {
					category: [],
					pagination: {
						page: page,
						limit: limit,
					},
				},
			});
		} else {
			res.status(200).json({
				success: true,
				messages: "Category ditemukan",
				data: {
					category: allData,
					pagination: {
						page: page,
						limit: limit,
					},
				},
			});
		}
	} catch (error) {
		next(error);
	}
}

async function getOneCategory(req, res, next) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				messages: "Request gagal! Wajib menyertakan parmeter id",
			});
		}

		const [data] = await db.execute(
			"SELECT * FROM categories WHERE id = ?",
			[id],
		);

		if (data.length === 0) {
			res.status(404).json({
				success: false,
				messages: "Category tidak ditemukan",
				data: {
					category: [],
				},
			});
		} else {
			res.status(200).json({
				success: true,
				messages: "Category ditemukan",
				data: data,
			});
		}
	} catch (error) {
		next(error);
	}
}

async function registerCategory(req, res, next) {
	try {
		const { name, slug } = req.body;

		const [existingCategory] = await db.execute(
			"SELECT * FROM categories WHERE slug = ?",
			[slug],
		);

		if (existingCategory.length > 0) {
			return res.status(400).json({
				success: false,
				message: "Slug sudah pernah di daftarkan",
			});
		}

		const [result] = await db.execute(
			"INSERT INTO categories (nama, slug) VALUES (?, ?)",
			[name, slug],
		);

		res.status(201).json({
			success: true,
			message: "Category berhasil dibuat",
			data: {
				id: result.insertId,
				name: name,
				slug: slug,
			},
		});
	} catch (error) {
		next(error);
	}
}

async function deleteCategory(req, res, next) {
	try {
		const { id } = req.params;

		const [existingCategory] = await db.execute(
			"SELECT * FROM categories WHERE id = ?",
			[id],
		);

		if (existingCategory.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Category tidak ditemukan",
			});
		}

		await db.execute("DELETE FROM categories WHERE id = ?", [id]);

		res.status(200).json({
			success: true,
			message: "Category berhasil dihapus",
			data: {
				id: id,
			},
		});
	} catch (error) {
		next(error);
	}
}

async function editCategory(req, res, next) {
	try {
		const { id } = req.params;
		const { name, slug } = req.body;

		const [existingUser] = await db.execute(
			"SELECT * FROM categories WHERE id = ?",
			[id],
		);

		if (existingUser.length < 0) {
			return res.status(404).json({
				message: "Category tidak ditemukan",
			});
		}

		const [result] = await db.execute(
			"UPDATE categories SET nama = ?, slug = ? WHERE id = ?",
			[name, slug, id],
		);

		res.status(200).json({
			success: true,
			message: "Category berhasil diperbaharui",
			data: {
				id: id,
				name: name,
				slug: slug,
			},
		});
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getAllCategories,
	getOneCategory,
	registerCategory,
	deleteCategory,
	editCategory,
};
