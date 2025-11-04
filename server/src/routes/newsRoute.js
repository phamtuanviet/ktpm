import express from "express"
import userAuth from "../middleware/userAuth.js"
import * as newsController from "../controllers/newsController.js";

export const newsRoute = express.Router();

newsRoute.get("/", newsController.getAllNews);
newsRoute.get("/count-news", newsController.countNews);
newsRoute.get("/get-news-by-search" ,newsController.getNewsBySearch)
newsRoute.get("/filter", newsController.fitlterNews);
newsRoute.get("/get-last", newsController.getLatestNews);
newsRoute.post("/", newsController.upload.single("thumbnail"), newsController.createNews);
// newsRoute.get("count-news", newsController.countNews);
newsRoute.get("/:id", newsController.getNewsById);
newsRoute.put("/:id", newsController.upload.single("thumbnail"), newsController.updateNews);
newsRoute.delete("/:id", newsController.deleteNews);
