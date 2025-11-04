import { prisma } from "../services/prisma.js";

const sanitizeUser = (user) => {
  const converted = { ...user };
  for (const key in converted) {
    if (typeof converted[key] === "bigint") {
      converted[key] = converted[key].toString();
    }
  }
  return converted;
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const getTotalUsers = async () => {
  return await prisma.user.findMany();
};

// Get users by search with pagination and sorting
export const getUsersBySearch = async (
  page = 1,
  pageSize = 10,
  query = "",
  sortBy = "id",
  sortOrder = "asc"
) => {
  const searchCondition = query
    ? {
        OR: [
          { id: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};
  const skip = (page - 1) * pageSize;

  const orderByOption = sortBy
    ? { [sortBy]: sortOrder.toLowerCase() === "desc" ? "desc" : "asc" }
    : { id: "asc" };

  const users = await prisma.user.findMany({
    where: searchCondition,
    skip: skip,
    take: pageSize,
    orderBy: orderByOption,
  });
  const sanitizedUsers = users.map(sanitizeUser);
  const totalUsers = await prisma.user.count({
    where: searchCondition,
  });
  return {
    users: sanitizedUsers,
    totalPages: Math.ceil(totalUsers / pageSize),
    currentPage: page,
  };
};

export const countUsers = async () => {
  const count = await prisma.user.count();
  return count;
};

export const createUser = async (name, email, password) => {
  return await prisma.user.create({
    data: { name, email, password },
  });
};

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUser = async (id, newData) => {
  const realData = {
    ...newData,
    isAccountVerified: newData.isAccountVerified === "true",
  };
  const user = await prisma.user.update({
    where: { id },
    data: realData,
  });

  const sanitizedUser = sanitizeUser(user);
  return sanitizedUser;
};

export const filterUsers = async (query) => {
  const operatorMap = {
    id: "equals",
    email: "contains",
    role: "equals",
    isAccountVerified: "equals",
    name: "contains",
  };
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  const where = {};
  Object.entries(query).forEach(([key, val]) => {
    if (val == null || val === "" || !operatorMap[key]) return;

    let parsed = val;
    if (key === "isAccountVerified") {
      parsed = val === "true";
    }

    if (operatorMap[key] === "contains") {
      where[key] = {
        contains: parsed,
        mode: "insensitive",
      };
    } else {
      where[key] = {
        [operatorMap[key]]: parsed,
      };
    }
  });

  if (Object.keys(where).length === 0) {
    throw new Error("At least one filter param is required");
  }

  const users = await prisma.user.findMany({
    where,
    skip,
    take: pageSize,
  });

  const sanitizedUsers = users.map(sanitizeUser);
  const totalUsers = await prisma.user.count({
    where,
  });
  return {
    users: sanitizedUsers,
    totalPages: Math.ceil(totalUsers / pageSize),
    currentPage: page,
  };
};

export const getUserByAdmin = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isAccountVerified: true,
      role: true,
      tickets: {
        include: {
          flightSeat: {
            select: {
              seatClass: true,
              price: true,
            },
          },
        },
      },
    },
  });
  const sanitizedUser = sanitizeUser(user);
  return sanitizedUser;
};
