const User = require("../schema/user");

const create = (newUserObj) => {
  const user = new User(newUserObj);
  return user.save();
};

const getAll = () => {
  return User.find(); 
};

const getById = (id) => {
  return User.findById(id);
};

const getByEmail = (email) => {
  return User.findOne({email});
};


const update = (id, updateObj) => {
  return User.findByIdAndUpdate(id, updateObj, { new: true, runValidators: true });
};

const remove = (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = { create, getAll, getById, update, remove, getByEmail };
