"use client";
import Header from "@/app/_components/Header";
import News from "@/app/_components/News";
import newsService from "@/lib/api/news";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Footer from "@/app/_components/Footer";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const formatDate = (date) => dayjs(date).format("MMMM Do, YYYY");

const NewsPage = () => {
  const params = useParams();
  const id = params.id;
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await newsService.getNewsById(id);
      setNews(res?.data || null);
      setError(null);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      setNews(null);
    } finally {
      setLoading(false);
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
    fetchNews();
  }, []);

  return (
    <>
      <Header />

      <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-8">
        {loading && (
          <div className="w-full max-w-3xl animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="h-64 bg-gray-200 rounded mb-6" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full" />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="w-full max-w-3xl text-red-500 text-center py-8">
            {error}
            <button
              onClick={fetchNews}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && news && (
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

      <News />
      <Footer />
    </>
  );
};

export default NewsPage;
