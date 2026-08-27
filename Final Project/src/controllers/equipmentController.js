const db = require("../config/db");

async function getAll(req, res, next) {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		if (!page || !limit) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		const offset = (page - 1) * limit;

		const [equipments] = await db.execute(
			"SELECT id, name, price FROM equipments WHERE status = 1 LIMIT ? OFFSET ?",
			[limit, offset],
		);

		if (equipments.length === 0) {
			res.status(200).json({
				messages: "Produk tidak ditemukan",
				data: {
					equipment: "",
					pagination: {
						page: page,
						limit: limit,
					},
				},
			});
		} else {
			res.status(200).json({
				data: {
					equipment: equipments,
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

async function getEquipmentDetail(req, res, next) {
	try {
		const id = parseInt(req.params.id);

		if (!id) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		const [equipment] = await db.execute(
			"SELECT * FROM equipments WHERE id = ? AND status = 1",
			[id],
		);

		if (equipment.length === 0) {
			res.status(200).json({
				messages: "Produk tidak ditemukan",
				data: {
					equipment: ""
				},
			});
		} else {
			res.status(200).json({
				data: {
					equipment: equipment,
				},
			});
		}
	} catch (error) {
		next(error);
	}
}

async function registerEquipment(req, res, next) {
	try {
		const { name, description, price, stock } = req.body;

		if (!name || !description || !price || !stock) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		const [existingequipment] = await db.execute(
			"SELECT * FROM equipments WHERE name = ? AND status = 1",
			[name],
		);
		if (existingequipment.length > 0) {
			return res.status(400).json({
				message: "Produk sudah pernah didaftarkan!",
			});
		}

		const [result] = await db.execute(
			"INSERT INTO equipments (name, description, price, stock) VALUES (?, ?, ?, ?)",
			[name, description, price, stock],
		);

		res.status(201).json({
			message: "Produk baru berhasil didaftarkan",
			data: {
				id: result.insertId,
				name: name,
				description: description,
			},
		});
	} catch (error) {
		next(error);
	}
}

async function editEquipment(req, res, next) {
	try {
		const { id, name, description, price, stock } = req.body;

		if (!name || !description || !price || !stock) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		const [existingequipment] = await db.execute(
			"SELECT * FROM equipments WHERE id = ? AND status = 1",
			[id],
		);
		if (existingequipment.length == 0) {
			return res.status(400).json({
				message: "Produk tidak ditemukan..",
			});
		} else {
			if (existingequipment[0].name != name) {
				const [existingName] = await db.execute(
					"SELECT * FROM equipments WHERE name = ? AND status = 1",
					[name],
				);
				if (existingName.length > 0) {
					return res.status(400).json({
						message: "Nama produk sudah pernah digunakan!",
					});
				}
			}
		}

		const [result] = await db.execute(
			"UPDATE equipments SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?",
			[name, description, price, stock, id],
		);

		res.status(201).json({
			message: "Produk berhasil diperbaharui",
			data: {
				id: id,
				name: name,
				description: description,
			},
		});
	} catch (error) {
		next(error);
	}
}

async function deleteEquipment(req, res, next) {
	try {
		const id = parseInt(req.params.id);

		if (!id) {
			return res.status(400).json({
				message: "Id tidak boleh kosong!",
			});
		}

		const [existingequipment] = await db.execute(
			"SELECT * FROM equipments WHERE id = ? AND status = 1",
			[id],
		);
		if (existingequipment.length == 0) {
			return res.status(400).json({
				message: "Produk tidak ditemukan..",
			});
		}

		const [result] = await db.execute(
			"UPDATE equipments SET status = 0 WHERE id = ?",
			[id],
		);

		res.status(201).json({
			message: "Produk berhasil dihapus",
			data: {
				id: id,
				name: existingequipment[0].name,
				description: existingequipment[0].description,
			},
		});
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getAll,
	getEquipmentDetail,
	registerEquipment,
	editEquipment,
	deleteEquipment,
};
