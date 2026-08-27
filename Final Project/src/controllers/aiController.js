
const chatInjection = require("../config/ai");

async function Chat(req, res, next) {
    if (!process.env.AI_URL || !process.env.AI_MODEL) {
        res.status(502).json({
            message: "AI model tidak di setup, api tidak bisa diakses",
        });
        
    }

	let { chat } = req.body;
	const user = req.user;

	chat = chatInjection +`\
        Currently the user logged in as role:
        ${user.role}

        If the user logged in as admin, answer questions about user only API is allowed.
        If the user logged in as user, answer questions about admin only API is not allowed.
        
        Here is the user input:\
        `+ chat;

	const response = await fetch(process.env.AI_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model: process.env.AI_MODEL,
			messages: [{ role: "user", content: chat }],
			stream: false,
			think: false,
			keep_alive: "1h",
		}),
	});

	const data = await response.json();
	console.log(data);
	res.status(201).json({
		message: JSON.parse(data.message.content),
	});
}

module.exports = {
	Chat,
};
