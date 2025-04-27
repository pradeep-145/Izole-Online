import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home.module.css";
import collage_1 from "../../assets/collage_1.jpg";
import collage_2 from "../../assets/collage_2.jpg";
import collage_3 from "../../assets/collage_3.png";
import collage_4 from "../../assets/collage_4.png";
import collage_5 from "../../assets/collage_5.png";

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: false,
    fade: true,
    responsive: [
      {
        breakpoint: 768, // For tablets
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For mobile phones
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  
  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        <div>
          <img
            src={collage_1}
            alt="img1"  
          />
        </div>
        <div>
          <img
            src={collage_2}
            alt="img2"
          />
        </div>
        <div>
          <img
            src={collage_3}
            alt="img3"
          />
        </div>
        <div>
          <img
            src={collage_4}
            alt="img4"
          />
        </div>
        <div>
          <img
            src={collage_5}
            alt="img5"
          />
        </div>
      </Slider>
    </div>
  );
};

export default Home;
