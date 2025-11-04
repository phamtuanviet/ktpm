import * as userRepository from "../repositories/userRepository.js";

export const getUserData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId" });
    }

    const user = await userRepository.getUserByAdmin(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      userData: {
        ...user,
      },
    });
  } catch (error) {
    console.error("Error in getUserData:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsersData = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error in getAllUsersData:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsersBySearch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const query = req.query.query || "";
    const sortBy = req.query.sortBy || "id";
    const sortOrder = req.query.sortOrder || "asc";

    const { users, totalPages, currentPage } =
      await userRepository.getUsersBySearch(
        page,
        pageSize,
        query,
        sortBy,
        sortOrder
      );

    return res.json({
      success: true,
      data: {
        users,
        totalPages,
        currentPage,
      },
    });
  } catch (error) {
    console.error("Error in getPaginatedUsers:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const countUsers = async (req, res) => {
  try {
    const count = await userRepository.countUsers();
    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error in countUsers:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const filterUsers = async (req, res) => {
  try {
    const users = await userRepository.filterUsers(req.query);
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    if (err.message.includes("At least one")) {
      return res.status(400).json({ success: false, error: err.message });
    }
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const users = await userRepository.updateUser(id, data);
    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
