const UserModel = require("../model/user"); 

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, dob, country, email, sex, phone, watchlists } = req.body;

    if (!firstName || !lastName || !dob || !country || !email || !sex || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await UserModel.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }


    const newUser = {
      firstName,
      lastName,
      dob,
      country,
      email,
      sex,
      phone,
      watchlists
    };

    const user = await UserModel.create(newUser);
    res.status(201).json({ message: "User created successfully", user });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if(Object.keys(updates).length === 0){
            return res.status(400).json({error: "Update at least one field"});
        }

        const existingUser = await UserModel.getById(id);
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await UserModel.update(id, updates)

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.getAll();
        
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getOneUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.getById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await UserModel.remove(id)

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = { createUser, updateUser, getAllUsers, getOneUser, deleteUser };
