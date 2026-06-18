import mongoose from "mongoose";


const { Schema } = mongoose


const connectionSchema = new Schema({
    fromUser:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"sender user is required"],
        ref: 'User'
    },
    toUser:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"receiver user is required"],
        ref: 'User'
    },
    status:{
        type: String,
        required: [true, 'status is required'],
        lowercase: true,
        enum: {
            values : ["interested", "ignored", "accepted", "rejected"],
            message: "invalid status"
        }
    }
},{
    timestamps:true
})


connectionSchema.index({fromUser:1, toUser:1})

export const Connection = mongoose.model('Connection',connectionSchema)