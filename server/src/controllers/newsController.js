import * as newsRepository from "../repositories/newsRepository.js";
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};
export const upload = multer({ storage, fileFilter });

export const getAllNews = async (req, res) => {
  try {
    const news = await newsRepository.getAllNews();
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const countNews = async (req, res) => {
  try {
    const count = await newsRepository.countNews();
    return res.json({
        success: true,
        count,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getLatestNews = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 5;
    const news = await newsRepository.getLatestNews(skip, take);
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNews = async (req, res) => {
  try {
    const { title, content, createdAt } = req.body;
    const isPublished = req.body.isPublished === "true";
    const thumbnailFile = req?.file || null;
    if (!title?.trim() || !content?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required field" });
    }
    const createdAtValue = createdAt
      ? new Date(createdAt).toISOString()
      : undefined;
    const newNews = await newsRepository.createNews(
      title,
      content,
      thumbnailFile,
      createdAtValue,
      isPublished
    );
    res.status(201).json({ success: true, data: newNews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const news = await newsRepository.findNewsById(id);

    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    }

    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNewsBySearch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const query = req.query.query || "";
    const sortBy = req.query.sortBy || "id";
    const sortOrder = req.query.sortOrder || "asc";

    const { news, totalPages, currentPage } =
      await newsRepository.getNewsBySearch(
        page,
        pageSize,
        query,
        sortBy,
        sortOrder
      );

    return res.json({
      success: true,
      data: {
        news,
        totalPages,
        currentPage,
      },
    });
  } catch (error) {
    console.error("Error in getPaginatedNews:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, isPublished, createdAt } = req.body;
    const thumbnailFile = req.file;

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (createdAt !== undefined) {
      const createAt = new Date(createdAt).toISOString();
      updateData.createdAt = createAt;
    }
    if (isPublished !== undefined)
      updateData.isPublished = isPublished === "true";
    if (thumbnailFile) updateData.thumbnailFile = thumbnailFile;

    const updated = await newsRepository.updateNews(id, updateData);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await newsRepository.deleteNews(id);
    res.json({ success: true, message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fitlterNews = async (req, res) => {
  try {
    const results = await newsRepository.filterNews(req.query);
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    if (err.message.includes("At least one"))
      return res.status(400).json({ success: false, error: err.message });
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};