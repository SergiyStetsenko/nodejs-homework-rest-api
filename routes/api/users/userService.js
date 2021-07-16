const { UserModel } = require("./userModel");
const { Conflict, NotFound, Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");

class AuthService {
  async singUpUser(userCreate) {
    const { username, password, email, subscription } = userCreate;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Conflict(`User with  email ${email} already exists`);
    }

    const newUser = await UserModel.create({
      username,
      passwordHash: await UserModel.hashPassword(password),
      email,
      subscription,
    });

    return newUser;
  }

  async singLogin() {
    const { email, password } = loginParams;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFound(`User with such email '${email}' not found`);
    }
    const isPasswordCorrect = await UserModel.isPasswordCorrect(
      password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new Unauthorized(`Provided password is wrong`);
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_AT,
    });

    return { user, token };
  }

  async logout(user) {
    console.log(user);
    const { _id } = user;

    await UserModel.findByIdAndUpdate(_id, { token: null }, { new: true });
  }


  async subscripStat(user) {
    const { email, subscription } = user;
    await UserModel.findOne({ email });
    
     await UserModel.isPasswordCorrect(
      subscription, email
    );
    

  
  }





}

exports.authService = new AuthService();
