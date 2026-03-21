import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please provide a username'],
        unique:true,
        trim:true,
        minlength:[3,'Username must be at least 3 characters long']
    },
    email:{
        type:String,
        required:[true,'Please provide a email'],
        unique:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/,'provide valid email']
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:[6,'Username must be at least 6 characters long'],
        select:false
    },
    profileImage:{
        type:String,
        default:null
    }

},{
    timestamps:true
})

//hash password before saving
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

//Compare password method
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPasswrd, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;