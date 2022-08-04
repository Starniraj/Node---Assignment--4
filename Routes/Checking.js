const Route = require("express").Router();
const bcrypt = require("bcrypt");
const { Router } = require("express");
const JWT = require("jsonwebtoken");

const { check, validationResult } = require("express-validator"); //to varify email..
const { users } = require("../db");

Route.post(
  "/signup",
  [
    check("email", "Please provide an valid email").isEmail(),
    check(
      "password",
      "Please provide password greater than 6 characters"
    ).isLength({
      //coming frm express validtr
      min: 6,
    }),
  ],
  async (req, res) => {
    //post mthd
    const { email, password } = req.body;

    const err = validationResult(req); //if there is any error in req,it ll sort

    if (!err.isEmpty()) {
      return res.status(400).json({
        err: err.array(), //err ll come in array manner
      });
    }

    //checking our postman email and password with the database

    let user = users.find((user) => {
      return user.email === email;
    });
    if (user) {
      return res.status(400).json({
        err: [
          {
            msg: "This user is already existed",
          },
        ],
      });
    }

    let hashpassword = await bcrypt.hash(password, 10); //The salt to be used in encryption. If specified as a number then a salt will be generated with the specified number of rounds and used.
    users.push({ email, password: hashpassword });

    const token = await JWT.sign(
      {
        email,
      },
      "abcjdncjdn",
      {
        expiresIn: 36000,
      }
    );
    res.json({ token });
    console.log(hashpassword); //password wll come in form of hash format ex:- $2b$10$Fq.ZZAUmgI9z1OhiBX1IH.6gQI6Kzb93mFmXUdBPv.mdiMWcoJeT6
    res.send("Checking page is working");
  }
);

Route.get("/all", (req, res) => {
  res.json(users);
});

module.exports = Route;