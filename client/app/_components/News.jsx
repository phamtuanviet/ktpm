"use client";
import newsService from "@/lib/api/news";
import { ArrowLeft, ArrowRight, SliceIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

dayjs.extend(advancedFormat);

const formatDate = (date) => dayjs(date).format("MMMM Do, YYYY");

// Avoid unnecessary re-renders of Slide component
const Slide = React.memo(({ image, title, createdAt }) => (
  <div className="w-full h-full bg-white rounded-xl p-4 cursor-pointer">
    <div className="w-full h-64 overflow-hidden rounded-t-xl">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover rounded-t-xl transform transition-all duration-300 hover:scale-110"
      />
    </div>
    <h2 className="text-2xl font-semibold mt-4">{title}</h2>
    <p className="text-gray-600 mt-2">{`Created at: ${formatDate(
      createdAt
    )}`}</p>
  </div>
));

const News = () => {
  const router = useRouter();
  const containerSlide = useRef(null);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(100 / slidesPerView);
  const [news, setNews] = useState([]);


  // xem tin tức khi bấm vào
  const watchNews = (id) => {
    router.push(`/news/${id}`);
  };

  const fetchNews = async (skip = 0, take = 5) => {
    try {
      const res = await newsService.getLatestNews(skip, take);
      if (res.data && res.data.length === news.length) {
        toast.info("Đã đạt đến giới hạn bài.");
      }
      setNews(res.data || []);
    } catch (error) {
      console.error("Error fetch news:", error);
      setNews([]);
    }
  };
  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const container = containerSlide.current;
    if (!container) return;

    const handleResize = () => {
      const width = container.offsetWidth;
      let newView = 3;
      if (width < 768) newView = 1;
      else if (width < 1024) newView = 2;
      setSlidesPerView(newView);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => observer.unobserve(container);
  }, []);
  useEffect(() => {
    const newWidth = slidesPerView > 0 ? 100 / slidesPerView : 100;
    setSlideWidth(newWidth);
  }, [slidesPerView]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev >= news.length - slidesPerView ? 0 : prev + 1
    );
  }, [news, slidesPerView]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? news.length - slidesPerView : prev - 1
    );
  }, [news, slidesPerView]);

  const xPosition = -(currentIndex * slideWidth);

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem] relative bg-gray-200 py-4">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-2xl font-medium">News</h2>
        <div className="flex gap-4">
          <ArrowLeft
            className="text-primary border-2 rounded-full bg-blue-100 border-primary w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
            onClick={handlePrev}
          />
          <ArrowRight
            className="text-primary border-2 rounded-full bg-blue-100 border-primary w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
            onClick={handleNext}
          />
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <motion.div
          ref={containerSlide}
          animate={{ x: `${xPosition}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex"
        >
          {news.map((slide) => (
            <div
              onClick={() => watchNews(slide.id)}
              key={slide.id}
              className="flex-none px-2 py-8"
              style={{ width: `${slideWidth}%` }}
            >
              <Slide
                image={slide?.thumbnailUrl || "/images/info.png"}
                title={slide.title}
                createdAt={slide.createdAt}
              />
            </div>
          ))}
        </motion.div>

        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({
            length: Math.max(1, Math.ceil(news.length - slidesPerView + 1)),
          }).map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === currentIndex
                  ? "bg-blue-600"
                  : "bg-gray-300 cursor-pointer"
              }`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center items-center pt-[1rem]">
        <button
          onClick={() => fetchNews(0, news.length + 5)}
          className="bg-primary text-white px-[4rem] py-[1rem] rounded-2xl text-xl cursor-pointer hover:bg-blue-500"
        >
          More
        </button>
      </div>
    </div>
  );
};

export default News;
