const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require('dotenv').config();

const userRoutes = require("./routes/user");
const itemRoutes = require("./routes/item");
const timeLogRoutes = require("./routes/timeLog");
const salaryRoutes = require("./routes/salary");

const app = express();

app.use(express.json());

// let corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true
// }
app.use(cors());

// Wake endpoint
app.get("/wake", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server is awake"
    });
});

mongoose.connect(process.env.MONGODB_STRING)

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/timelogs", timeLogRoutes);
app.use("/salaries", salaryRoutes);

app.listen(process.env.PORT || 4000, () => {
    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
});

