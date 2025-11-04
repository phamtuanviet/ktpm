"use client";
import { slides } from "@/data/hardData";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Avoid unnecessary re-renders by memoizing the Slide component
const Slide = React.memo(({ image, destination, content }) => (
  <div className="w-full h-full bg-white rounded-xl shadow-lg p-4 cursor-pointer">
    <div className="w-full h-64 overflow-hidden rounded-t-xl">
      <img
        src={image}
        alt={destination}
        className="w-full h-full object-cover rounded-t-xl transform transition-all duration-300 hover:scale-110"
      />
    </div>
    <h2 className="text-2xl font-semibold mt-4">{destination}</h2>
    <p className="text-gray-600 mt-2">{content}</p>
  </div>
));

// Apart of the body component that displays famous tourist destinations
const FamousTourist = () => {
  const containerSlide = useRef(null);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const totalSlides = slides.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(100 / slidesPerView);
  const timerRef = useRef(null);

  useEffect(() => {
    // Set initial slides per view based on window width
    const container = containerSlide.current;
    if (!container) return;

    const handleResize = () => {
      const width = container.offsetWidth;
      let newView = 3;
      if (width < 768) newView = 1;
      else if (width < 1024) newView = 2;
      setSlidesPerView(newView);
    };

    // Reset slides when the size changes
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => observer.unobserve(container);
  }, []);

  
  useEffect(() => {
    const newWidth = slidesPerView > 0 ? 100 / slidesPerView : 100;
    setSlideWidth(newWidth);
  }, [slidesPerView]);

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(handleNext, 5000);
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev >= totalSlides - slidesPerView ? 0 : prev + 1
    );
    resetTimer();
  }, [totalSlides, slidesPerView]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? totalSlides - slidesPerView : prev - 1
    );
    resetTimer();
  }, [totalSlides, slidesPerView]);

  useEffect(() => {
    timerRef.current = setInterval(handleNext, 5000);
    return () => clearInterval(timerRef.current);
  }, [handleNext]);

  const xPosition = -(currentIndex * slideWidth);

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mb-[2rem] relative">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-2xl font-medium">Discover the world</h2>
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

      {/* Carousel */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          ref={containerSlide}
          animate={{ x: `${xPosition}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex"
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-none p-2"
              style={{ width: `${slideWidth}%` }}
            >
              <Slide
                image={slide.image}
                destination={slide.destination}
                content={slide.content}
              />
            </div>
          ))}
        </motion.div>

        {/* Pagination */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({
            length: Math.ceil(totalSlides - slidesPerView + 1),
          }).map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === currentIndex ? "bg-blue-600" : "bg-gray-300 cursor-pointer"
              }`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamousTourist;
