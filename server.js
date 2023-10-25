import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";


const port = 6969;
const server = app.listen(port, async () => {
    console.log(`Listening port http://localhost:${port} ...`);
});
