const mongoose = require('mongoose');

const fileschema = new mongoose.Schema({
    file: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("File",fileschema);