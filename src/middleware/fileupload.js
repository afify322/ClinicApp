const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { body,validationResult } = require('express-validator')
const patient = require('../models/patient');
const {checkValidationResult,validate} =require('../middleware/validator')


cloudinary.config({
  cloud_name: 'dquzcc6kw',
  api_key: 956728166899899,
  api_secret: 'lgMkP22bTqHWfaY5lxRKybkBMsc',
});
const fileFilter = (req, file, cb) => {
  if(!req.body.date||!req.body.dose||!req.body.id||!req.body.name){
   cb("date , dose , name and id must be exist and valid ",false)
  }
  patient.findById(req.body.id).then((data)=>{
    if(!data){
      return new Error("Please enter Valid Id")
    }
  }).catch((err)=> cb(" Invalid id",false))

  if (
    file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'some-folder-name',
    format: async (req, file) => 'png' || 'jpg' || 'jpeg', // supports promises as well
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

exports.parser = multer({ storage, fileFilter }).array('images', 12);
