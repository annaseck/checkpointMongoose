const mongoose = require('mongoose');

const personShema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    age : {
        type : Number
    },
    favoriteFoods : [String]          
});

module.exports = mongoose.model('Person', personShema);