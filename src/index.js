import dotenv from 'dotenv'
import mongoose from 'mongoose';
import { DB_NAME } from './constants.js';
import connectDB from './db/index.js';
import express from 'express';
import { app } from "./app.js"; 

dotenv.config({
    path:'./env'
});
connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000, ()=>{
        console.log(`server is running at port: ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed!! ",error);
});

// (
//    async ()=>{
//       try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error",(e)=>{
//            console.error("Error: ",e);
//            throw e;
//         })
//               app.listen(process.env.PORT,()=>{
//                 console.log(`app is listening on port ${process.env.PORT}`);
//               })
//       }

//       catch(error){
//         console.error("Error: ",error);
//         throw error;
//       }
//     }
// )();


