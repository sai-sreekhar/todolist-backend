const express = require("express");
const Joi = require("joi");
const router = express.Router();
const User = require("../models/User");

// router.get("/", async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (error) {
//         res.json(error);
//     }
// });

router.post("/signin", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error)
    return res
      .status(400)
      .send({ isSucess: false, err: error.details[0].message });

  try {
    const user = await User.find(
      { email: req.body.email },
      { password: req.body.password }
    );
    if (user.length == 0) {
      res.status(401).send({ isSucess: false, err: "Authentication Failed" });
    } else {
      res.send({ isSucess: true, userId: user[0]._id });
    }
  } catch (error) {
    console.log("SignIn Failed", error);
    res.status(500).send({ isSucess: false, err: error });
  }
});

router.post("/signup", async (req, res) => {
  const { error } = validateUserSignUp(req.body);
  if (error)
    return res
      .status(400)
      .send({ isSucess: false, err: error.details[0].message });

  const check = await User.find({ email: req.body.email });
  if (check.length != 0) {
    res.status(401).send({ isSucess: false, err: "User Already Exists" });
    return;
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    dob: req.body.dob ? req.body.dob : null,
    address: req.body.address ? req.body.address : null,
    city: req.body.city ? req.body.city : null,
    state: req.body.state ? req.body.state : null,
    country: req.body.country ? req.body.country : null,
    pincode: req.body.pincode ? req.body.pincode : null,
  });

  try {
    const newUser = await user.save();
    res.send({ isSucess: true, userId: newUser._id });
  } catch (error) {
    console.log("SignUp Failed", error);
    res.status(500).send({ isSucess: false, err: error });
  }
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(user);
}

function validateUserSignUp(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    phone: Joi.string().min(10).max(10).required(),
    dob: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    pincode: Joi.string(),
  });

  return schema.validate(user);
}

module.exports = router;
