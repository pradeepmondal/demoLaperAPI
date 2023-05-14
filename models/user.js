const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    email: { 
        type: String,
        required: true 
    },
    password: { 
        type: String,
        required: true
        
    },

    isGAuth: {
        type: Boolean,
        required: true
    },

    date_created : {
        type: Date,
        required: true,
        default: Date.now

    }

});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); };
  
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

module.exports = mongoose.model("User", userSchema);
