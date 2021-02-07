const jwt = require('jsonwebtoken');
const admin = require('../models/admin');
const patient = require('../models/patient');

exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decode = jwt.verify(token, process.env.SECRET);

    const user = await admin.findById(decode._id);

    if (!user) {
      throw new Error();
    }
    req.user.token = token;
    next();
  } catch (error) {
    res.status(401).send({ Error_Flag: 1, message: 'please authintecate' });
  }
};
