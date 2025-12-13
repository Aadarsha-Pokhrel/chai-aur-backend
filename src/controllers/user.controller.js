import {asyncHandler} from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiErrors.js';
import {User} from '../models/user.model.js';
import  {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async(req,res)=>{

   //get user detail from frontend
   //validation - not emppty and others
   //check if user already exist : from username and email
   //check for images,check for avatar
   //upload them to cloudnary , avatar checking in cloudnary
   //create user object - create entry in db
   //remove password and referesh token from response
   //check for user creation 
   //return response

   const {fullname,email,username,password} = req.body;
  //  console.log("email: ",email);

  if([fullname,email,username,password].some((field)=>
    field?.trim()==="")){
       throw new ApiError(400,"All field are required");
  }

  const existedUser = await User.findOne({
    $or:[{username},{email}]
  })

  if(existedUser){
    throw new ApiError(409,"User already exist");
  }

  // console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath= req.files?.coverimage[0]?.path;

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0){
    coverImageLocalPath = req.files.coverimage[0].path;
  }

  if(!avatarLocalPath){
    throw new ApiError("Avatar file is required");
  }

  const avatar =  await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath); 

    if(!avatar){
      throw new ApiError("Avatar file is required");  
    }

    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverimage: coverImage?.url || "",
      email,
      password,
      username : username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    if(!createdUser){
      throw new ApiError(500,"Something went wrong while registering the user");
    }

    return res.status(201).json(
      new ApiResponse(200,createdUser,"User registered successfully")
    )
})

export {registerUser}