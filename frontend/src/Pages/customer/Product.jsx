import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import vite from '/vite.svg'
const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const product = location.state?.product;
  const product ={
    name:"sample",
    price:20,
    quantity:20,
    description:"nadlsanfcosndfosanfj",
    images:[
      {
      image:[
        'https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/OIP.xU1B1N4yNIitYKdy61_5RgHaIC?w=185&h=200&c=7&r=0&o=5&pid=1.7',
        'https://th.bing.com/th/id/OIP.f4kxBVKD8iYdwIG3ZtjpsgHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7',
        'https://th.bing.com/th/id/OIP.s_SjZaWQOOPk1VUs_nKbawHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7'
        ,'https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain'
      ],
      color:"black"
    },
      {
      image:['https://th.bing.com/th/id/OIP.xU1B1N4yNIitYKdy61_5RgHaIC?w=185&h=200&c=7&r=0&o=5&pid=1.7',
        'https://th.bing.com/th/id/OIP.f4kxBVKD8iYdwIG3ZtjpsgHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7',
        'https://th.bing.com/th/id/OIP.s_SjZaWQOOPk1VUs_nKbawHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7'
        ,'https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain'
      ],
      color:"blue"
    },
      {
      image:['https://th.bing.com/th/id/OIP.f4kxBVKD8iYdwIG3ZtjpsgHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7',
        ,
        'https://th.bing.com/th/id/OIP.s_SjZaWQOOPk1VUs_nKbawHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7'
        ,'https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/OIP.xU1B1N4yNIitYKdy61_5RgHaIC?w=185&h=200&c=7&r=0&o=5&pid=1.7'

      ],
      color:"brown"
    },
      {
      image:['https://th.bing.com/th/id/OIP.s_SjZaWQOOPk1VUs_nKbawHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7','https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/OIP.xU1B1N4yNIitYKdy61_5RgHaIC?w=185&h=200&c=7&r=0&o=5&pid=1.7',
        'https://th.bing.com/th/id/OIP.f4kxBVKD8iYdwIG3ZtjpsgHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7'
      ],
      color:"green"
    },
      {
      image:['https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain',
         'https://th.bing.com/th/id/OIP.xU1B1N4yNIitYKdy61_5RgHaIC?w=185&h=200&c=7&r=0&o=5&pid=1.7',
        'https://th.bing.com/th/id/OIP.f4kxBVKD8iYdwIG3ZtjpsgHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7',
        'https://th.bing.com/th/id/OIP.s_SjZaWQOOPk1VUs_nKbawHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7'
      ],
      color:"olive green"
    },
  ]

  }
  const [images,setImages]=useState(product.images[0].image)
  const [image, setImage]=useState(images[0]);
  return (
    <div className="mt-24">
      <Navbar></Navbar>
      <main className="mx-4 flex flex-col">

      <section className=" flex flex-row"> {/* product overview  */}
          <section className=" flex-1"> {/* image [section  */}
              <img src={image} alt="product image" />
              <div className="flex">

              {
                images.map((image,index)=>
                  <div key={index} onClick={()=>{
                    setImage(image)
                  }}>
                    <img src={image} alt="" />
                  </div>
                )
              }
              </div>
         </section>
          <section className="flex-1 overflow-y-scroll scrollbar-hide">
          <p>{product.name}</p>
          <p>{product.price}</p>
          <p>{product.description}</p>
          <p>{product.quantity>0?"in Stock":"Out of stock"}</p>
          </section>
      </section>
      <section className="w-screen flex gap-12 p-10 overflow-x-scroll scrollbar-hide">{/* Colors choose color section  */}
        {product.images.map((image,i)=>
          <div key={i} className=" " onClick={()=>{
           setImages(image.image)
           setImage(image.image[0])
          }}>
            <img src={image.image} alt="" className="w-20 rounded " />
            <p>{image.color}</p>
          </div>
        )}
      </section>
      <section className="">{/* Review section  */}
            <section className="">
                <p>hr</p>
                <div className="flex justify-between p-4">

                </div>
            </section>
            <section className="flex flex-col">
        <p>hr</p>
              
            </section>
      </section>
      </main>
    </div>
  );
};

export default Product;
