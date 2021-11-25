const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const UserSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    encry_password: { type: String, required: true },
    lastActiveAt: {type:Date},
    userStatus: {type: String, default: true},
    walletAmount: {type: Number, default: 0},
    currentSessionId: {type: String, default:"not assigned"},
    isVerified: {type:String,default:"false"},
    Key: {type:String,default:"null"},
    salt: String,

 password: String,
    
  
     
  },
  {
    timestamps: true
  }
);

// UserSchema
// .virtual("password")
// .set(function (password) {
//     this._password = password;
//     this.salt = uuidv1();
//     this.encry_password = this.securePassword(password);
// })
// .get(function () {
//     return this._password;
// });

  

// UserSchema.methods = {
//   autheticate: function (plainpassword) {
    
//     return this.securePassword(plainpassword) === this.encry_password;
// },

// securePassword: function (plainpassword) {
//     if (!plainpassword) return "";
//     try {
//       return crypto
//         .createHmac("sha256", this.salt)
//         .update(plainpassword)
//         .digest("hex");
//     } catch (err) {
//       return "";
//     }
//   },
// };

module.exports = mongoose.model("User", UserSchema);
