const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const { UserInputError } = require("apollo-server");
dotenv.config();

function generateToken(user) {
  return jwt.sign({...user}, process.env.JWT_SECRET, { expiresIn: "7 days" });
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong crendetials";
        throw new UserInputError("Wrong crendetials", { errors });
      }

      const token = generateToken({ ...user._doc });
      console.log(user.createdAt);

      return {
        ...user._doc,
        id: user._id,
        token,
        createdAt:user.createdAt
      };
    },

    async register(
      parent,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("errors", { errors });
      }

      const user = await User.find({ username });
      if (user) {
        throw new UserInputError("username already exist", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      //validate user data
      const hashPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password: hashPassword,
        username,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = await generateToken({
        id: res.id,
        email: res.email,
        username: res.username,
      });

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
