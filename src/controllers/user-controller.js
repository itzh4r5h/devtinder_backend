import { CustomError } from "../middlewares/error-middleware.js"
import { User } from "../models/user-model.js"
import { profileUpdateValidator } from "../utils/user-validators.js"




export const viewProfile = async (req,res) => {
    res.status(200).json(req.user)
}

export const updateProfile = async(req,res)=>{

    const errorMessage = profileUpdateValidator(req.body)

    if(errorMessage){
        throw new CustomError(errorMessage,400)
    }

    const user = await User.findByIdAndUpdate(req.user._id,req.body,{runValidators:true, returnDocument:'after'})

    res.status(200).json({
        success: true,
        message: 'updated successfully',
        user
    })
}
