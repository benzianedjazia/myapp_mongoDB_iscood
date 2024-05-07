const { server } = require("../server");
const config = require("../config")
const mongoose = require("mongoose");
mongoose.connect(config.mongoUri);




const db = mongoose.connection;
db.on('error', (err) => {
    console.log(err)
});

db.on("open", () => {
    console.log("database to connected");
});
 
/* app.listen(config.port, () => {
    console.log(`app running`);
});
 */

server.listen(config.port, () => {
    console.log(`app running`);
});
 
