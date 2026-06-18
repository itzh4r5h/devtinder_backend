export const asyncHandler = (controllerFunc)=>{
    return (req,res,next)=>{
        Promise.resolve(controllerFunc(req,res,next)).catch(next)
    }
}

