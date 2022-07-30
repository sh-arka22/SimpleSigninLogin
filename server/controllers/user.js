const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = require('../jwtTocken');
const validatePhoneNumber = require('validate-phone-number-node-js');
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
 
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.create = async (req, res, next) => {
 try {
  const { name, phone, active,password} = req.body;
  var pass = req.body.password.toString();
  var no = req.body.phone.toString();
  if(pass.length<7){
    return res.status(401).json({message: "entered incorrect credentials"});
  }
  const result = validatePhoneNumber.validate(no);
  if(!result){
    return res.status(401).json({message: "entered incorrect phone number type"});
  }
  const hashedPassword = await hashPassword(password);
  const newUser = new User({ name, phone, active: active, password: hashedPassword});
  await newUser.save();
  res.json({
   data: newUser
  })
 } catch (error) {
  next(error)
 }
};

exports.login = async (req, res, next) => {
try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return res.status(401).json({message: "you entered wrong credentials"});

    const accessToken = jwt.sign({user: user}, secretKey.secret, {expiresIn: "1d"});
    await User.findByIdAndUpdate(user._id, { accessToken });
    user.accessToken = accessToken;
    user.active = true;
    user.updated_at = Date.now();
    user.save();
    res.status(200).json({
    user,
    accessToken: accessToken,
    message: 'you are logged in'
    })
    } catch (error) {
        next(error);
    }
};
