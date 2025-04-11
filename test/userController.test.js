const userController = require('../controller/user');
const UserModel = require('../model/user');

jest.mock('../model/user'); 

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should return 400 if required fields are missing', async () => {
      req.body = {}; 

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "All fields are required" });
    });

    it('should return 400 if email already exists', async () => {
      req.body = {
        firstName: "John",
        lastName: "Doe",
        dob: "2000-01-01",
        country: "USA",
        email: "john@example.com",
        sex: "M",
        phone: "1234567890"
      };
      UserModel.getByEmail.mockResolvedValue({ _id: '1', email: "john@example.com" });

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email is already in use" });
    });

    it('should create user successfully', async () => {
      req.body = {
        firstName: "Jane",
        lastName: "Doe",
        dob: "2000-01-01",
        country: "USA",
        email: "jane@example.com",
        sex: "F",
        phone: "1234567890"
      };
      UserModel.getByEmail.mockResolvedValue(null);
      UserModel.create.mockResolvedValue({ _id: "1", ...req.body });

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created successfully",
        user: expect.objectContaining({ _id: "1", email: "jane@example.com" })
      });
    });
  });

  describe('updateUser', () => {
    it('should return 400 if no fields to update', async () => {
      req.params = { id: "1" };
      req.body = {};

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Update at least one field" });
    });

    it('should return 404 if user not found', async () => {
      req.params = { id: "1" };
      req.body = { firstName: "Updated" };
      UserModel.getById.mockResolvedValue(null);

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it('should update user successfully', async () => {
      req.params = { id: "1" };
      req.body = { firstName: "Updated" };

      UserModel.getById.mockResolvedValue({ _id: "1" });
      UserModel.update.mockResolvedValue({ _id: "1", firstName: "Updated" });

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User updated successfully",
        user: { _id: "1", firstName: "Updated" }
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return 404 if no users', async () => {
      UserModel.getAll.mockResolvedValue([]);

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No users found" });
    });

    it('should return all users', async () => {
      const mockUsers = [{ _id: "1" }, { _id: "2" }];
      UserModel.getAll.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
    });
  });

  describe('getOneUser', () => {
    it('should return 404 if user not found', async () => {
      req.params = { id: "1" };
      UserModel.getById.mockResolvedValue(null);

      await userController.getOneUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it('should return user if found', async () => {
      req.params = { id: "1" };
      const mockUser = { _id: "1", name: "Test" };
      UserModel.getById.mockResolvedValue(mockUser);

      await userController.getOneUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });
  });

  describe('deleteUser', () => {
    it('should return 404 if user not found', async () => {
      req.params = { id: "1" };
      UserModel.remove.mockResolvedValue(null);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it('should delete user successfully', async () => {
      req.params = { id: "1" };
      const deletedUser = { _id: "1", name: "Test" };
      UserModel.remove.mockResolvedValue(deletedUser);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
        user: deletedUser
      });
    });
  });
});
