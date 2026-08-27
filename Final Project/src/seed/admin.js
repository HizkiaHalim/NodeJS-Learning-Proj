require("dotenv").config();

const db = require('../config/db')
const bcrypt = require("bcrypt");


async function seedAdmin() {
	try {
		const [existingRootAdmin] = await db.execute(
			"SELECT * FROM users WHERE name = 'root' AND role = 'Admin' AND email = 'root@gmail.com'"
		);
		if (existingRootAdmin.length > 0) {
            console.log('Root admin sudah ada')
		}
        else {
            const hashedPassword = await bcrypt.hash('rootadmin123', 10);
    
            const [result] = await db.execute(
                "INSERT INTO users (name, email, password, role) VALUES ('root', 'root@gmail.com', ?, 'Admin')",
                [hashedPassword],
            );
    
            console.log("Root admin ditambahkan")
        }
        await db.end();
	} catch (error) {
        console.error('Seed admin gagal:', error);
        process.exit(1);
	}
}

seedAdmin();