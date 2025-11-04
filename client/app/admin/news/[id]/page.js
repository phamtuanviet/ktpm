"use client";
import React, { useEffect, useState } from "react";
import HearderAdmin from "@/app/_components/HearderAdmin";
import Sidebar from "@/app/_components/Sidebar";
import { useParams } from "next/navigation";
import newsService from "@/lib/api/news";
import dayjs from "dayjs";

const formatDate = (date) => dayjs(date).format("MMMM Do, YYYY");

const page = () => {
  const { id } = useParams();
  const [currentId, setCurrentId] = useState(id);
  const [news, setNews] = useState(null);
  const fetchNews = async () => {
    try {
      const res = await newsService.getNewsById(currentId);
      setNews(res?.data || null);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews(null);
    }
  };

  const formatContent = (text) => {
    if (!text || typeof text !== "string") return null;

    const normalizedText = text.replace(/\\n/g, "\n");

    return normalizedText.split(/\n{2,}/g).map((paragraph, pIndex) => (
      <p key={`para-${pIndex}`} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph.split("\n").map((line, lIndex, lines) => (
          <React.Fragment key={`line-${pIndex}-${lIndex}`}>
            {line}
            {lIndex !== lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  useEffect(() => {
    setCurrentId(id);
  }, [id]);
  useEffect(() => {
    fetchNews();
  }, [currentId]);
  return (
    <div className="min-h-screen w-full flex">
      <Sidebar type="big" />
      <div className="flex-1">
        <HearderAdmin />
        <div className="p-5 flex flex-col items-center justify-between">
          <div className="w-full md:w-[80%] flex flex-row justify-center items-center font-medium">
            {news && (
              <article className="w-full max-w-3xl space-y-6">
                <header className="border-b pb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {news.title}
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Đăng ngày: {formatDate(news.createdAt)}
                    {news.updatedAt !== news.createdAt && (
                      <span className="ml-4">
                        (Cập nhật: {formatDate(news.updatedAt)})
                      </span>
                    )}
                  </p>
                </header>

                <figure className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                  <img
                    src={news?.thumbnailUrl || "/images/info.png"}
                    alt={news.title || "Ảnh minh họa bài viết"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </figure>

                <div className="prose max-w-none">
                  {formatContent(news.content)}
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
