const jwt = require("jsonwebtoken");
const User = require("../models/user");

const createToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  const user = await User.create(req.body);
  const token = createToken(user);
  res.json({ user, token });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = createToken(user);
  res.json({ user, token });
};
