import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import collage_1 from "../../assets/collage_1.jpg";
import collage_2 from "../../assets/collage_2.jpg";
import collage_3 from "../../assets/collage_3.png";
import collage_4 from "../../assets/collage_4.png";
import collage_5 from "../../assets/collage_5.png";
import styles from "./Home.module.css";

const Home = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: windowWidth < 768 ? 600 : 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: windowWidth > 480, // Hide arrows on small mobile devices
    pauseOnHover: false,
    fade: true,
    lazyLoad: "ondemand",
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1200, // For large screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 992, // For medium screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 768, // For tablets
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 480, // For mobile phones
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          autoplaySpeed: 2000,
        },
      },
    ],
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {[
          { src: collage_1, alt: "img1" },
          { src: collage_2, alt: "img2" },
          { src: collage_3, alt: "img3" },
          { src: collage_4, alt: "img4" },
          { src: collage_5, alt: "img5" },
        ].map((image, index) => (
          <div key={index} className={styles.slideItem}>
            <img
              src={image.src}
              alt={image.alt}
              className={styles.carouselImage}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Home;
