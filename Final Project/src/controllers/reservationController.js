const db = require("../config/db");

async function AddToCart(req, res, next) {
	const connection = await db.getConnection();

	try {
		const { equipment_id, quantity } = req.body;
		const user = req.user;
		let reservation_id = 0;
		let cart_detail = [];

		if (!equipment_id || !quantity) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		const [reservationExist] = await db.execute(
			"SELECT count(*) as count FROM \
            reservation_carts r \
            JOIN users u ON r.user_id = u.id \
            WHERE u.id = ? AND r.reservation_status = 'Waiting For Payment'",
			[user.id],
		);
		
		await connection.beginTransaction();

		if (reservationExist[0].count > 0) {
			const [reservation] = await db.execute(
				"SELECT r.id, rd.id as reservation_detail_id FROM \
                reservation_carts r \
                JOIN users u ON r.user_id = u.id \
                JOIN reservation_detail rd ON rd.reservation_id = r.id \
                WHERE u.id = ? AND r.reservation_status = 'Waiting For Payment' AND rd.equipments_id = ?  AND rd.status = 1 LIMIT 1",
				[user.id, equipment_id],
			);

			const [baseReservation] = await db.execute(
				"SELECT r.id as id FROM \
				reservation_carts r \
				JOIN users u ON r.user_id = u.id \
				WHERE u.id = ? AND r.reservation_status = 'Waiting For Payment'",
				[user.id],
			);

			if (reservation[0]) {
				const [qtyCheck] = await db.execute(
					"SELECT rd.qty, e.stock FROM\
					reservation_detail rd\
					JOIN equipments e ON rd.equipments_id = e.id\
					WHERE rd.id = ? AND rd.status = 1",
					[reservation[0].reservation_detail_id],
				);

				if (quantity <= 0) {
					await connection.rollback();
					return res.status(400).json({
						message: "Quantity harus lebih besar dari 0",
					});
				}

				if (qtyCheck[0].qty + quantity > qtyCheck[0].stock) {
					await connection.rollback();
					return res.status(400).json({
						message: "Stock tidak cukup",
					});
				}

				const [result] = await db.execute(
					"UPDATE reservation_detail SET qty = qty + ? WHERE id = ?",
					[quantity, reservation[0].reservation_detail_id],
				);
			} else {
				const [equipCheck] = await db.execute(
					"SELECT * FROM equipments WHERE id = ? AND status = 1",
					[equipment_id],
				);

				if (equipCheck.length == 0) {
					await connection.rollback();
					return res.status(400).json({
						message: "Alat tidak terdaftar",
					});
				}

				if (equipCheck[0].stock < quantity) {
					await connection.rollback();
					return res.status(400).json({
						message: "Stock alat tidak mencukupi",
					});
				}

				await db.execute(
					"INSERT INTO reservation_detail (reservation_id, equipments_id, qty) VALUES (?, ?, ?)",
					[baseReservation[0].id, equipment_id, quantity],
				);
			}
			
			await connection.commit();

			cart_detail = await db.execute(
				"SELECT rd.qty, e.name, e.price FROM\
                    reservation_carts r\
                	JOIN reservation_detail rd ON rd.reservation_id = r.id \
                    JOIN equipments e ON e.id = rd.equipments_id\
                    WHERE rd.reservation_id = ? AND rd.status = 1",
				[reservation[0] ? reservation[0].id : baseReservation[0].id],
			);

			reservation_id = reservation[0]
				? reservation[0].id
				: baseReservation[0].id;
		} else {
			const [resultreservation] = await db.execute(
				"INSERT INTO reservation_carts (user_id) VALUES (?)",
				[user.id],
			);

			const [result] = await db.execute(
				"INSERT INTO reservation_detail (reservation_id, equipments_id, qty) VALUES (?, ?, ?)",
				[resultreservation.insertId, equipment_id, quantity],
			);

			await connection.commit();
			cart_detail = await db.execute(
				"SELECT rd.qty, e.name, e.price FROM\
                    reservation_carts r\
                	JOIN reservation_detail rd ON rd.reservation_id = r.id \
                    JOIN equipments e ON e.id = rd.equipments_id\
                    WHERE rd.id = ? AND rd.status = 1",
				[resultreservation.insertId],
			);

			reservation_id = resultreservation.insertId;
		}


		res.status(201).json({
			message: "Produk berhasil dimasukan ke cart",
			data: {
				reservation_id: reservation_id,
				name: user.name,
				cart_detail: cart_detail[0],
			},
		});
	} catch (error) {
		await connection.rollback();
		next(error);
	}
}

async function RemoveFromCart(req, res, next) {
	try {
		let { reservation_id, equipment_id } = req.body;
		const user = req.user;

		if (!equipment_id) {
			return res.status(400).json({
				message: "equipment_id tidak boleh kosong!",
			});
		}

		if (!reservation_id) {
			const [equipCheck] = await db.execute(
				"SELECT * FROM equipments WHERE id = ?",
				[equipment_id],
			);

			if (!equipCheck[0]) {
				return res.status(400).json({
					message: "Alat tidak terdaftar",
				});
			}

			const [cart] = await db.execute(
				'SELECT id FROM reservation_carts WHERE user_id = ? AND reservation_status = "Waiting For Payment" and status = 1',
				[user.id],
			);

			if (!cart[0]) {
				return res.status(400).json({
					message: "Anda masih belum memiliki cart!",
				});
			}

			reservation_id = cart[0].id;
		}

		const [equipmentExist] = await db.execute(
			"SELECT id FROM reservation_detail WHERE equipments_id = ? AND reservation_id = ? AND status = 1",
			[equipment_id, reservation_id],
		);

		if (!equipmentExist[0]) {
			return res.status(400).json({
				message: "Produk tidak ada di cart anda!",
			});
		}

		await db.execute(
			"UPDATE reservation_detail SET status = 0 WHERE id = ?",
			[equipmentExist[0].id],
		);

		GetCart(req, res, next);
	} catch (error) {
		next(error);
	}
}

async function GetCart(req, res, next) {
	try {
		const user = req.user;

		const [cart] = await db.execute(
			'SELECT id FROM reservation_carts WHERE user_id = ? AND status = 1 AND reservation_status = "Waiting For Payment"',
			[user.id],
		);

		if (cart[0]) {
			const [cart_detail] = await db.execute(
				"SELECT e.name, e.price AS price_per_item, rd.qty, (rd.qty * e.price) AS total_price FROM\
				reservation_detail rd\
				JOIN equipments e ON rd.equipments_id = e.id\
				WHERE rd.reservation_id = ? AND rd.status = 1",
				[cart[0].id],
			);

			if (cart_detail[0]) {
				res.status(200).json({
					data: {
						cart_id: cart[0].id,
						cart_detail: [cart_detail],
					},
				});
			} else {
				res.status(200).json({
					messages:
						"Cart anda kosong. Mulai tambahkan barang ke cart untuk mulai meminjam.",
					data: {
						cart_id: "",
						cart_detail: [],
					},
				});
			}
		} else {
			res.status(200).json({
				messages:
					"Cart anda kosong. Mulai tambahkan barang ke cart untuk mulai meminjam.",
				data: {
					cart_id: "",
					cart_detail: [],
				},
			});
		}
	} catch (error) {
		next(error);
	}
}

async function MinusFromCart(req, res, next) {
	try {
		let { reservation_id, equipment_id, quantity } = req.body;
		const user = req.user;

		if (!equipment_id || !quantity) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		if (!reservation_id) {
			const [cart] = await db.execute(
				'SELECT id FROM reservation_carts WHERE user_id = ? AND reservation_status = "Waiting For Payment" and status = 1',
				[user.id],
			);

			if (cart.length === 0) {
				return res.status(400).json({
					message: "Anda masih belum memiliki cart!",
				});
			}

			reservation_id = cart[0].id;
		}

		const equipCheck = await db.execute(
			"SELECT * FROM equipments WHERE id = ? AND status = 1",
			[equipment_id],
		);

		if (equipCheck[0].length == 0) {
			return res.status(400).json({
				message: "Alat tidak terdaftar",
			});
		}

		const [equipmentExist] = await db.execute(
			"SELECT id, qty FROM reservation_detail WHERE equipments_id = ? AND reservation_id = ? AND status = 1",
			[equipment_id, reservation_id],
		);

		if (!equipmentExist[0]) {
			return res.status(400).json({
				message: "Produk tidak ada di cart anda!",
			});
		}
		if (equipmentExist[0].qty < quantity) {
			return res.status(400).json({
				message:
					"Jumlah produk di cart anda tidak cukup untuk dikurangi!",
			});
		}

		const { result } = await db.execute(
			"UPDATE reservation_detail SET\
				status = CASE\
					WHEN qty = ? THEN 0\
					ELSE 1\
				END,\
				qty = qty - ?\
			WHERE id = ?",
			[quantity, quantity, equipmentExist[0].id],
		);

		GetCart(req, res, next);
	} catch (error) {
		next(error);
	}
}

async function Checkout(req, res, next) {
	const connection = await db.getConnection();
	try {
		let { reservation_id } = req.body;
		const user = req.user;

		if (!reservation_id) {
			const [cart] = await db.execute(
				'SELECT id FROM reservation_carts WHERE user_id = ? AND reservation_status = "Waiting For Payment" and status = 1',
				[user.id],
			);

			if (!cart[0]) {
				return res.status(400).json({
					message: "Anda masih belum memiliki cart!",
				});
			}

			reservation_id = cart[0].id;
		}

		await connection.beginTransaction();

		const [cart_detail] = await db.execute(
			"SELECT e.id as product_id, e.name, e.price AS price_per_item, rd.qty, (rd.qty * e.price) AS total_price FROM\
			reservation_detail rd\
			JOIN equipments e ON rd.equipments_id = e.id\
			WHERE rd.reservation_id = ? AND rd.status = 1 FOR UPDATE",
			[reservation_id],
		);

		let total_price = 0;
		if (cart_detail.length > 0) {
			for (let i = 0; i < cart_detail.length; i++) {
				const [product] = await db.execute(
					"SELECT * FROM equipments WHERE id = ? and status = 1 and stock >= ? FOR UPDATE",
					[cart_detail[i].product_id, cart_detail[i].qty],
				);

				if (!product[0]) {
					await connection.rollback();
					res.status(400).json({
						messages:
							"Stok barang tidak mencukupi, kurangi jumlah barang yang di pesan",
						data: {
							cart_id: reservation_id,
							cart_detail: cart_detail[i],
						},
					});
				} else {
					await db.execute(
						"UPDATE equipments SET stock = stock - ? WHERE id = ?",
						[cart_detail[i].qty, cart_detail[i].product_id],
					);
				}
				total_price = total_price + cart_detail[i].total_price;
			}

			await db.execute(
				"INSERT INTO payments(reservation_id, total_paid) VALUES(?, ?)",
				[reservation_id, total_price],
			);

			await db.execute(
				"UPDATE reservation_carts SET reservation_status = 'Payment Received' WHERE id = ?",
				[reservation_id],
			);

			await connection.commit();
			res.status(200).json({
				messages:
					"Pembayaran sukses, berikan order_id kepada admin untuk verifikasi.",
				data: {
					order_id: reservation_id,
				},
			});
		} else {
			res.status(200).json({
				messages:
					"Cart anda kosong. Mulai tambahkan barang ke cart untuk mulai meminjam.",
				data: {
					cart_id: "",
					cart_detail: [],
				},
			});
		}
	} catch (error) {
		next(error);
	}
}

async function UpdateReservationStatus(req, res, next) {
	const connection = await db.getConnection();
	try {
		const statusOrder = [
			"Waiting For Payment",
			"Payment Received",
			"Processing",
			"Borrowed",
			"Returned",
		];

		const { reservation_id, status } = req.body;

		if (!reservation_id || !status) {
			return res.status(400).json({
				message: "Field tidak boleh kosong!",
			});
		}

		const [reservation_status] = await db.execute(
			"SELECT reservation_status FROM reservation_carts WHERE id = ?",
			[reservation_id],
		);

		const newIndex = statusOrder.indexOf(status);
		const currentIndex = statusOrder.indexOf(
			reservation_status[0].reservation_status,
		);

		if (newIndex === -1) {
			return res.status(400).json({
				message: "Status baru tidak valid",
			});
		}

		if (!(newIndex === currentIndex + 1)) {
			return res.status(400).json({
				message:
					"Perubahan status invalid dari " +
					reservation_status[0].reservation_status +
					" ke " +
					status +
					"!",
			});
		}
		await connection.beginTransaction();

		const  [reservation_detail]  = await db.execute(
			"SELECT * FROM reservation_detail WHERE reservation_id = ? AND status = 1",
			[reservation_id],
		);

		try {
			await db.execute(
				"UPDATE reservation_carts SET reservation_status = ? WHERE id = ?",
				[status, reservation_id],
			);

			if (status == "Returned") {
				for (let i = 0; i < reservation_detail.length; i++) {
					await db.execute(
						"UPDATE equipments SET stock = stock + ? WHERE id = ?",
						[
							reservation_detail[i].qty,
							reservation_detail[i].equipments_id,
						],
					);
				}
			}
		} catch (error) {
			await connection.rollback();
			next(error);
		}

		await connection.commit();

		res.status(200).json({
			messages: "Update reservation status berhasil!",
			data: {
				reservation_id: reservation_id,
				reservation_detail: reservation_detail,
			},
		});
	} catch (error) {
		next(error);
	}
}

module.exports = {
	AddToCart,
	RemoveFromCart,
	GetCart,
	MinusFromCart,
	Checkout,
	UpdateReservationStatus,
};
