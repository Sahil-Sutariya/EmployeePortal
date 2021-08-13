const mongoose = require('mongoose');

const schemaDefinition = {
    employeeId: {
        type : String,
        required : true
    },

    employeeName: {
        type : String
    },

    date: {
        type : Date,
        required : true
    },

    status : {
        type : String,
        required : true
    }

}

var projectsSchema = new mongoose.Schema(schemaDefinition);

module.exports = mongoose.model('Project', projectsSchema);