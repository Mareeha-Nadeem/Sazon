import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

// Inline styles to avoid any CSS conflicts
const styles = {
  carouselWrapper: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    backgroundColor:"white",
    marginBottom: "20px"
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    padding: "10px 20px",
    margin: "0 0 10px 0"
  },
  slideTrack: {
    display: "flex",
    transition: "transform 0.5s ease",
    width: "100%"
  },
  slide: {
    flex: "0 0 100%",
    width: "100%",
    boxSizing: "border-box"
  },
  image: {
    width: "100%",
    display: "block"
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255, 255, 255, 0.5)",
    borderRadius: "50%",
    padding: "5px",
    zIndex: 10,
    border: "none",
    cursor: "pointer"
  },
  leftButton: {
    left: "10px"
  },
  rightButton: {
    right: "10px"
  },
  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    gap: "5px"
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    border: "none",
    padding: 0,
    cursor: "pointer"
  },
  activeDot: {
    width: "16px",
    backgroundColor: "#ff8c00",
    borderRadius: "4px",
    marginBottom:"10px"
  }
};

// If needed, we can combine styles
const combineStyles = (...styles) => {
  return Object.assign({}, ...styles);
};

export default function ExploreCarousel() {
  // Define slides directly
  const slides = [
    { image: "/eat.jpg", alt: "Food plate presentation" },
    { image: "/juice.jpg", alt: "Fresh juice" },
    { image: "/oven.jpg", alt: "Cooking in oven" }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  
  // Auto-rotation effect
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(nextSlide, 5000);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex]);
  
  return (
    <div style={styles.carouselWrapper}>
      <h2 style={styles.heading}>What's New?</h2>
      
      <div style={{...styles.carouselWrapper, margin: 0}}>
        {/* Slides container */}
        <div 
          style={{
            ...styles.slideTrack,
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} style={styles.slide}>
              <img 
                src={slide.image}
                alt={slide.alt}
                style={styles.image}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation arrows */}
        <button 
          onClick={prevSlide}
          style={combineStyles(styles.navButton, styles.leftButton)}
          aria-label="Previous slide"
        >
          <ArrowLeftCircle size={24} color="#444" />
        </button>
        
        <button 
          onClick={nextSlide}
          style={combineStyles(styles.navButton, styles.rightButton)}
          aria-label="Next slide"
        >
          <ArrowRightCircle size={24} color="#444" />
        </button>
      </div>
      
      {/* Indicator dots */}
      <div style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={combineStyles(
              styles.dot,
              index === currentIndex ? styles.activeDot : {}
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}