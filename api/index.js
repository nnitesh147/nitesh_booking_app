import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
import User from "./models/User.js"
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken";
import cookieParser from "cookie-parser"
import imageDownloader from "image-downloader";
import multer from "multer";
import fs from "fs"
import Place from "./models/Place.js";
import Booking from "./models/Booking.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mime from "mime-types";


const app = express();
const bucket = process.env.BUCKET_NAME;

app.use(cors({
    credentials:true,
    origin:"http://localhost:5173",
}))
app.use(express.json());
app.use(cookieParser());


config({
    path:"./config.env"
})


function connectDB(){
    try{
        mongoose
        .connect(process.env.MONGO_URL, {
        dbName: "airbnb",
    })
    }catch(error){
        console.log(error);
    }
}

app.get("/api/test" , (req , res)=>{
    res.json({
        success:true,
    })
})

async function uploadToS3(path, originalFilename, mimetype) {
    const client = new S3Client({
      region: 'ap-southeast-2',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
    const parts = originalFilename.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: 'public-read',
    }));
    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
  }
  

function getUserDataFromReq(req){
    return new Promise((resolve , reject)=>{
        jwt.verify(req.cookies.token , process.env.JWT_SECRET , {} , async (error , userData)=>{
            if(error) throw error;
            resolve(userData);
        })
    })
}

app.post("/api/register" , async (req , res)=>{
    connectDB();
    const {name , email , password} = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password , 10)
        });
        res.json(userDoc);
    } catch (error) {
        res.status(422).json(error);
    }
})

app.post("/api/login" , async (req , res)=>{
    connectDB();
    try {
        const {email , password} = req.body;

        const user = await User.findOne({email}).select("+password");

    
        if(!user){
            return res.status(404).json({
                message:"Register First"
            })
        };
        const isMatch = await bcrypt.compare(password , user.password);

    
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid email Id or Password"
            })
        }else{
            jwt.sign({
                email:user.email,
                _id:user._id
              }, process.env.JWT_SECRET , {}, (err,token) => {
                if (err) throw err;
                res.cookie('token', token).json(user);
              });
        }
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
})

app.post("/api/logout" , (req , res)=>{
    connectDB();
    res.cookie("token" , "" , {
        expires:new Date(Date.now()),
    }).json(true);
})

app.get("/api/profile" , (req , res)=>{
    connectDB();
    try{
        const {token} = req.cookies;
        if(token){
            jwt.verify(token , process.env.JWT_SECRET , {} , async (error , userData)=>{
                if(error) throw error;
                const {name , email , _id} = await User.findById(userData._id);
                res.json({name , email , _id});
            })
        }else{
            res.status(404).json({});
        }
    }catch(error){
        res.status(500).json({});
    }
})


app.post('/api/upload-by-link' , async (req , res)=>{
    connectDB();
    const {link} = req.body;
    const newName = 'photo'+Date.now() + '.jpg';
    await imageDownloader.image({
        url:link,
        dest:'/tmp/' + newName,
    });
    const url = await uploadToS3('/tmp/' + newName , newName , mime.lookup('/tmp/' + newName));
    res.json(url);
})

const photosMiddleWare = multer({dest:"/tmp"});

app.post("/api/upload" , photosMiddleWare.array("photos" , 100) , async (req , res)=>{
    connectDB();
    const uploadedfiles = [];
    for(let i =0;i<req.files.length;i++){
        const {path , originalname , mimetype} = req.files[i];
        const url = await uploadToS3(path , originalname , mimetype);
        uploadedfiles.push(url);
    }
    res.json(uploadedfiles);
});

app.post("/api/places" , (req , res)=>{
    connectDB();
       const {token} = req.cookies;
       const {
        title,address,addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      } = req.body;
    jwt.verify(token , process.env.JWT_SECRET , {} , async (error , userData)=>{
        if(error) throw error;
        const placeDoc = await Place.create({
            owner:userData._id,
            title,address,photos:addedPhotos,description,
            perks,extraInfo,checkIn,checkOut,maxGuests , price
        });
        res.json(placeDoc);
    });
})


app.get("/api/user-places" , (req , res)=>{
    connectDB();
    const {token} = req.cookies;
    jwt.verify(token , process.env.JWT_SECRET , {} , async (error , userData)=>{
        if(error) throw error;
        const id = userData._id;
        res.json(await Place.find({owner:id}));
    });
})

app.put("/api/places" , async (req , res)=>{
    connectDB();
    const {token} = req.cookies;
       const {
        id , title,address,addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      } = req.body;
      const placeDoc = await Place.findById(id);
      jwt.verify(token , process.env.JWT_SECRET , {} , async (error , userData)=>{
        if(userData._id === placeDoc.owner.toString()){
            placeDoc.set({
                title,address,photos:addedPhotos,description,
                perks,extraInfo,checkIn,checkOut,maxGuests,price,
                });
            await placeDoc.save();
            res.json("updated");
        }
    });
})

app.get("/api/places/:id" , async (req , res)=>{
    connectDB();
    const {id} = req.params;
    res.json(await Place.findById(id));
})


app.get("/api/places" , async(req , res)=>{
    connectDB();
    res.json(await Place.find());
})

app.post("/api/bookings" ,  async (req , res)=>{
    connectDB();
    const userData = await getUserDataFromReq(req);
    const {
        place,checkIn,checkOut,numberOfGuests,name,phone,price,
      } = req.body;
      Booking.create({
        place,checkIn,checkOut,numberOfGuests,name,phone,price,
        user:userData._id,
      }).then((doc) => {
        res.json(doc);
      }).catch((err) => {
        throw err;
      });
})


app.get("/api/bookings" , async (req , res)=>{
    connectDB();
    const userdata =  await getUserDataFromReq(req);
    res.json(await Booking.find({user:userdata._id}).populate('place'));
})


app.listen(3000 , ()=>{
    connectDB();
    console.log("Server is working");
})
