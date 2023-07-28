const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/interfaceManagement";
const Schema = mongoose.Schema;
mongoose
  .connect(url)
  .then(() => {
    console.log("Mongodb Connectd...");
  })
  .catch((err) => {
    console.log(err);
  });
