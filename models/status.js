const mongoose = require('mongoose');

const schemaDefinition = {
    status: {
        type: String,
        require: true
    }
};

var statusesSchema = new mongoose.Schema(schemaDefinition);

module.exports = mongoose.model('Status', statusesSchema);