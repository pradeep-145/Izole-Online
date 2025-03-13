import React from 'react'
import Navbar from '../Components/Navbar'

const ProductList = () => {
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
            img: "https://getketchadmin.getketch.com/product/h=300,w=250,q=85,fit=cover/8905040937373/660/HLZ4000072_6.jpg",
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
 
    return (
        <div>
            <Navbar />
            <div className='my-28 items-center justify-center flex'>
                <select defaultValue="Pick a text editor" className="select select-primary">
                    <option>Select Category</option>
                    <option>Men</option>
                    <option>Boys</option>
                    <option>Leisure wear</option>
                </select>
            </div>

            
            <div className='grid lg:grid-cols-3 lg:mx-28'>
                {products.map((product, index) => (
                    <div key={index} className="card bg-base-100 w-96 shadow-sm border border-zinc-400 my-10">
                        <figure>
                            <img src={product.img} alt={product.title} className="w-72 h-72 object-cover rounded-lg mt-5" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">{product.title}</h2>
                            <p>{product.desc}</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            



        </div>
    )
}

export default ProductList