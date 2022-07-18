
const routes = require('./routes/routes')
const express = require("express");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", routes)

app.listen(PORT, () => {
    console.log("Server running at port %d", PORT);
});

