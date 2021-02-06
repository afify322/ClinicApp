const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
 
cloudinary.config({ 
    cloud_name:'dquzcc6kw', 
    api_key: 956728166899899, 
    api_secret:'lgMkP22bTqHWfaY5lxRKybkBMsc'
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'some-folder-name',
    format: async (req, file) => 'png'||'jpg'||'jpeg', // supports promises as well
    public_id: (req, file) => Date.now()+ '-' + file.originalname,
  },
});
 
exports.parser = multer({ storage: storage,fileFilter:fileFilter }).array('images', 12);
 