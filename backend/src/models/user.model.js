import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    fullname:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic:{
        type:"String",
        default: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
    }
},{
    timestamps: true,
})

const User = mongoose.model('User', userSchema);
export default User;