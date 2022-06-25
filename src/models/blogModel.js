const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const validator = require("validator")


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "Project_Author",
        required: true
    },
    tags: {
        type: [String],
    },
    category: {
        type: [String],
        required: true,
    },
    subcategory: {
        type: [String]
    },
    isDeleted: {
        type: Boolean,
        default: false,
        // validate(value) {
        //     if (!validator.isBoolean(value)) {
        //         throw new Error("Invalid Response");
        //     }
        // }
    },
    isPublished: {
        type: Boolean,
        default: false
    }


}, { timestamps: true });

module.exports = mongoose.model('Project_Blog', blogSchema) 