const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FilmShema = new Schema({
 name:{
     type: String,
     required:true
 },
    type:{
        type: String,
        required:true
    },
    uuid:{
        type: String,
        required:true
    },
    director: {
        type: String,
    },
    country: {
        type: String,
    },
    rate: {
        type: Number,
    },
    year: {
        type: Number,
    },
    link: {
        type: String,
    },
    picture:{
     type: String
    }
})

mongoose.model('films',FilmShema)