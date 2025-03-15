import React, { useEffect, useState } from "react";

const ProductPreview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = [
    {
      img: "https://media.landmarkshops.in/cdn-cgi/image/h=300,w=250,q=85,fit=cover/max-new/1000014664185-Purple-WINE-1000014664185_01-2100.jpg",
      title: "Casual T-Shirt",
      desc: "Premium quality cotton t-shirt for a stylish and comfortable look.",
    },
    {
      img: "https://media-us.landmarkshops.in/cdn-cgi/image/h=300,w=250,q=85,fit=cover/max-new/1000013589469-Black-BLACK-1000013589469_01-2100.jpg",
      title: "Classic Black Shirt",
      desc: "Elegant black shirt designed for all occasions.",
    },
    {
      img: "https://media-uk.landmarkshops.in/cdn-cgi/image/h=300,w=250,q=85,fit=cover/max-new/1000012552677-Green-OLIVEGREEN-1000012552677_02-2100.jpg",
      title: "Olive Green Jacket",
      desc: "A perfect blend of warmth and style with this olive green jacket.",
    },
    {
      img: "https://getketchadmin.getketch.com/product/8905040937373/660/HLZ4000072_6.jpg",
      title: "Trendy Joggers",
      desc: "Comfortable and stylish joggers for your active lifestyle.",
    },
    {
      img: "https://media.landmarkshops.in/cdn-cgi/image/h=300,w=250,q=85,fit=cover/max-new/1000014100555-Black-BLACK-1000014100555_04-2100.jpg",
      title: "Athleisure Pants",
      desc: "Soft and flexible athleisure pants for everyday wear.",
    },
    {
      img: "https://media.landmarkshops.in/cdn-cgi/image/h=300,w=250,q=85,fit=cover/max-new/1000014715091-Black-BLACK-1000014715091_01-2100.jpg",
      title: "Slim Fit Jeans",
      desc: "Classic slim-fit jeans with a modern touch.",
    },
    {
      img: "https://media.landmarkshops.in/cdn-cgi/image/h=300,w=250,q=85,fit=cover/max-new/1000014787101-Blue-BLUE-1000014787101_02-2100.jpg",
      title: "Blue Denim Jacket",
      desc: "Iconic blue denim jacket for a timeless look.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="products" className="flex flex-col items-center py-28">
      <h1 className="text-5xl font-bold mb-16">Featured Products</h1>
      <div className="flex items-center gap-40">
      <div>
      <div className="carousel w-full rounded-box p-4 flex justify-center">
        {products.map((product, index) => (
          <div
            key={index}
            className={`carousel-item w-80 ${currentIndex === index ? "block" : "hidden"}`}
          >

            <div className="card bg-neutral w-80 shadow-md">
              <figure className="p-4">
                <img src={product.img} alt={product.title} className="w-60 h-60 object-cover rounded-lg" />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-lg">{product.title}</h2>
                <p className="text-sm">{product.desc}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-sm">Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 py-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${currentIndex === index ? "bg-primary" : "bg-gray-400"}`}
          />
        ))}
      </div>
      </div>
      <div>
        <p className="text-xl font-semibold">Here are some of our top rated products by our customers <br/>that symbolize our authenticity and quality.</p>
        <a href="/productList" className="btn btn-primary btn-md mt-10 ">View All Products</a>
      </div>
      </div>
    </div>
  );
};

export default ProductPreview;
