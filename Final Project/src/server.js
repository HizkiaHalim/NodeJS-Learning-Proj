require("dotenv").config();

const express = require("express");

const app = express();
const port = 3000;

const authRoute = require("./routes/authRoute.js");
const equipmentRoute = require("./routes/equipmentRoute.js");
const reservationRoute = require("./routes/reservationRoute.js");
const aiRoute = require("./routes/aiRoutes.js");
const errorHandler = require("./middlewares/errorHandler.js");

app.use(express.json());
app.use("/", authRoute);
app.use("/equipment", equipmentRoute);
app.use("/reservation", reservationRoute);
app.use("/ai", aiRoute);

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
