import path from "path";
import express from "express";
import multer from "multer";
import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import fs from "fs";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
const __dirname = path.resolve();
cloudinary.config().cloud_name; //gets the env variables

//TODO remove the file from, local storage after
router.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    if (!req.files) {
      return res.status(400).json({ msg: "no file uploaded" });
    }
    const file = req.files.image;
    file.mv(`${__dirname}/images/${file.name}`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
    });
    cloudinary.v2.uploader.upload(
      `${__dirname}/images/${file.name}`,
      {
        resource_type: "image",
        upload_preset: "unsigned",
        public_id: `${path.parse(file.name).name}`, //to use this as the url need to change the upload presets "use filename defined public ID " setting
      },
      function (error, result) {
        if (error) {
          console.log(error);
          res.json(error);
        }
        console.log(result);
        res.status(200).json(result.url);
      }
    );
  })
);

export default router;
