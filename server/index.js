const express = require("express");
const modules = require("./modules");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const app = express();

app.set("view engine", "ejs");
app.disable("x-powered-by");
app.use(express.json());
modules.routes(express, app);
modules.logger();
app.listen(PORT, () => console.log(`server is running @ PORT ${PORT}`));
