import Mongoose from "mongoose";
import bcrypt from "bcrypt";
const saltRounds = 10;
const userSchema = Mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, require: true, unique: true },
    DOB: { type: String, require: true },
    password: { type: String, required: true },
    profile_img:{type:String},
    company_name:{type:String}
  },
  {
    timestamps: { createdAt: "created_at", updateAt: "updated_at" },
    versionKey: false,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (inputPassword) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(inputPassword, passwordHash, function (err, result) {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export default Mongoose.model("user", userSchema);
