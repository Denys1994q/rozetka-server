import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        middleName: {
            type: String,
        },
        sex: {
            type: String,
        },
        phone: {
            type: String,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            // required: true,
        },
        dateOfBirth: {
            type: Date, 
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
