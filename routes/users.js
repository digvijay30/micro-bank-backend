import express from "express";
const router = express.Router();
import User from "../DB/model/User.js";
import jwt from "jsonwebtoken";
import upload from "../DB/multer/Upload.js";
import dotenv from "dotenv";
import multer from "multer";
import bcrypt from 'bcrypt'
dotenv.config();
const newToken = (userObject) => {
  return jwt.sign({ userObject }, process.env.JWT_KEY, { expiresIn: "1h" });
};
router.get("/", (req, res) => {
  return res.send("server is connected");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const getEmail = await User.findOne({ email: email }).exec();
    if (!getEmail) {
      return res.json({ type: "error", msg: "User not exist", status: 401 });
    }

    const result = await getEmail.comparePassword(password);
    if (!result) {
      return res.json({
        type: "failed",
        msg: "Email and password not valid",
        status: 400,
      });
    }

    const token = newToken(getEmail);

    return res.json({ token, status: 200, type: "success" });
  } catch (err) {
    return res.json({
      type: "error",
      msg: err.message,
      status: 400,
    });
  }
});

const uploads = upload.single("profileImages");
router.post("/update", (req, res) => {
  uploads(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.json({ type: "error", msg: err.message });
    } else if (err) {
      return res.json({ type: "error", msg: err.message });
    } else if (!req.file) {
      return res.json({ type: "error", msg: "File is Required !" });
    } else {
      const query = { _id: req.body._id };
      const updateUser = await User.updateOne(query, {
        $set: { profile_img: req.file.filename },
      });
      return res.json({ type: "success", msg: "File uploaded successfully!" });
    }
  });
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const userRegister = {
      name: data.name,
      email: data.email,
      DOB: data.DOB,
      password: data.password,
    };

    const getEmail = await User.findOne({ email: userRegister.email })
      .lean()
      .exec();
    if (getEmail) {
      return res.json({ type: "error", msg: "Email Id already exist" });
    }

    let usePost = await User.create(userRegister);
    return res.status(201).json({ usePost });
  } catch (err) {
    return res.json({ type: "error", msg: err.message });
  }
});

router.patch("/", async (req, res) => {
  try {
    const query = { _id: req.body._id };
    const {oldpassword,password} = req.body;
    if(oldpassword && password)
    {
       let user = await User.findOne(query).exec();
       let result = await user.comparePassword(oldpassword);
       if(!result)
       {
          return res.json({type:"error",msg:"Old password not matched"});
       }
       else
       {
        req.body.password = await bcrypt.hash(req.body.password, 10);
       }
     
    }
    const findByEmail = await User.findOne({email:req.body.email});
    if(findByEmail && findByEmail._id.toString() != query._id.toString())
    {
      return res.json({type:"error",msg:"email id already registered with another account"})
    }
    
    delete req.body.oldpassword;
    const updateUser = await User.updateOne(query, { $set: req.body });
    if(updateUser)
    {
      const userDetails = await User.findById(query);
      const token = newToken(userDetails);
      return res.json({
        type: "success",
        msg: "Profile Successfully Updated",
        token: token,
      });
    }
    else
    {
      return res.json({type:"error",msg:"Something went Wrong"})
    }
    
  } catch (err) {
    return res.json({ type: "error", msg: err.message });
  }
});


export default router;
