import { prisma } from "../services/prisma.js";
import cloudinary from "../services/cloudinary.js";
import { Readable } from "stream";
import dotenv from "dotenv";
dotenv.config();



// Function to sanitize news data to convert BigInt to string and format Date
const sanitizeNews = (news) => {
  const converted = { ...news };
  for (const key in converted) {
    const val = converted[key];
    if (typeof converted[key] === "bigint") {
      converted[key] = converted[key].toString();
    }
    if (val instanceof Date) {
      converted[key] = val.toISOString();
    }
  }
  return converted;
};

const uploadThumbnailToCloudinary = async (file) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: "qairline_upload",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Lỗi upload:", error);
    throw error;
  }
};

export const getAllNews = async () => {
  return await prisma.news.findMany({
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};


export const countNews = async () => {
  const count = await prisma.news.count();
  return count;
};

export const createNews = async (
  title,
  content,
  thumbnailFile = null,
  createdAt = new Date(),
  isPublished = false
) => {
  let thumbnailUrl = null;
  if (thumbnailFile) {
    thumbnailUrl = await uploadThumbnailToCloudinary(thumbnailFile);
  }

  return await prisma.news.create({
    data: {
      title,
      content,
      thumbnailUrl,
      createdAt,
      isPublished,
    },
  });
};

export const findNewsById = async (id) => {
  return await prisma.news.findUnique({
    where: { id },
  });
};

export const updateNews = async (id, newData) => {
  if (newData.thumbnailFile) {
    newData.thumbnailUrl = await uploadThumbnailToCloudinary(
      newData.thumbnailFile
    );
    delete newData.thumbnailFile;
  }

  return await prisma.news.update({
    where: { id },
    data: newData,
  });
};

export const publishNews = async (id) => {
  return await prisma.news.update({
    where: { id },
    data: { isPublished: true },
  });
};

export const unpublishNews = async (id) => {
  return await prisma.news.update({
    where: { id },
    data: { isPublished: false },
  });
};

export const getNewsBySearch = async (
  page = 1,
  pageSize = 10,
  query = "",
  sortBy = "id",
  sortOrder = "asc"
) => {
  const searchCondition = query
    ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};
  const skip = (page - 1) * pageSize;
  const orderByOption = sortBy
    ? { [sortBy]: sortOrder.toLowerCase() === "desc" ? "desc" : "asc" }
    : { id: "asc" };
  const news = await prisma.news.findMany({
    where: searchCondition,
    skip: skip,
    take: pageSize,
    orderBy: orderByOption,
  });
  const sanitizedNews = news.map(sanitizeNews);
  const totalNews = await prisma.news.count({
    where: searchCondition,
  });
  return {
    news: sanitizedNews,
    totalPages: Math.ceil(totalNews / pageSize),
    currentPage: page,
  };
};

export const deleteNews = async (id) => {
  return await prisma.news.delete({
    where: { id },
  });
};

export const filterNews = async (query) => {
  const operatorMap = {
    id: "equals",
    title: "contains",
    isPublished: "equals",
  };
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  const where = {};
  Object.entries(query).forEach(([key, val]) => {
    if (!val || !operatorMap[key]) return;
    if (key === "title") {
      where[key] = {
        [operatorMap[key]]: val,
        mode: "insensitive",
      };
    } else if (key === "isPublished") {
      where[key] = { [operatorMap[key]]: val === "true" };
    } else if (key === "id") {
      const num = parseInt(val, 10);
      if (!isNaN(num)) {
        where[key] = { [operatorMap[key]]: num };
      }
    }
  });
  if (Object.keys(where).length === 0)
    throw new Error("At least one filter param is required");
  const news = await prisma.news.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });
  const sanitizedNews = news.map(sanitizeNews);
  const totalNews = await prisma.news.count({
    where,
  });
  return {
    news: sanitizedNews,
    totalPages: Math.ceil(totalNews / pageSize),
    currentPage: page,
  };
};

export const getLatestNews = async (skip, take) => {
  return await prisma.news.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};