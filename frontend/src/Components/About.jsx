import React from 'react'

const About = () => {
    return (
        <div id="about" className='m-4 mb-20'>
            <div>
                <h1 className='text-center font-bold text-3xl mt-32'>About Us</h1>
                <p className='text-justify text-lg p-10'>Welcome to Izole – Authentic Clothing, your go-to destination for premium men’s and boys’ fashion. Based in Tirupur, the heart of India’s textile industry, we take pride in delivering high-quality trousers, t-shirts, and leisurewear that blend style, comfort, and durability.

                    At Izole, we believe clothing is more than just fabric—it’s a statement of individuality. Our collections are designed to cater to modern trends while ensuring a timeless appeal, making every outfit effortlessly stylish. Whether you're looking for casual everyday wear or something trendy and comfortable, we’ve got you covered.

                    With a strong commitment to quality craftsmanship and authenticity, we source the finest fabrics and employ meticulous tailoring techniques to ensure every piece meets the highest standards. Our goal is to provide fashion that is not only stylish but also long-lasting and comfortable for all occasions.

                    Explore our latest collection and redefine your wardrobe with Izole – Authentic Clothing.</p>
            </div>

            <div>  
                <p className='text-3xl text-center font-bold p-10'>Why Choose Us?</p>
                <div className='flex flex-col gap-10 mb-10'>
                <div className='flex justify-center gap-10'>
                <div className="card bg-neutral text-primary-content w-96 hover:scale-105 hover:transition-all delay-100">
                    <div className="card-body">
                        <p> ✔ Premium-quality fabrics</p>
                    </div>
                </div>
                <div className="card bg-neutral text-primary-content w-96 hover:scale-105 hover:transition-all delay-100">
                    <div className="card-body">
                        <p>✔ Trendy yet timeless designs</p>
                    </div>
                </div>
                </div>
                <div className='flex justify-center gap-10'>
                <div className="card bg-neutral text-primary-content w-96 hover:scale-105 hover:transition-all delay-100">
                    <div className="card-body">
                        <p> ✔ Comfort-driven styles for every occasion</p>
                    </div>
                </div>
                <div className="card bg-neutral text-primary-content w-96 hover:scale-105 hover:transition-all delay-100">
                    <div className="card-body">
                        <p> ✔ Made with passion in Tirupur</p>
                    </div>
                </div>
                </div>
                </div>
                <p className='text-center font-semibold text-xl'>Join us on our journey of fashion excellence and experience authentic clothing like never before!</p>
            </div>
        </div>
    )
}

export default About