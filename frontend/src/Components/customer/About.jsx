import React from "react";
import { Check, Award, Truck, ThumbsUp, Users } from "lucide-react";

const About = () => {
  return (
    <div id="about" className="bg-wineRed text-mustard py-24">
      <div className="container mx-auto px-4">
        {/* Header section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold font-serif mb-4">About Izole</h2>
          <div className="w-24 h-1 bg-mustard mx-auto mb-8"></div>
          <p className="text-xl opacity-80 max-w-3xl mx-auto">
            Redefining authentic clothing with passion and precision
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16 mx-10">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold">Our Story</h3>
            <p className="text-lg leading-relaxed">
              Welcome to Izole – Authentic Clothing, your go-to destination for
              premium men's and boys' fashion. Based in Tirupur, the heart of
              India's textile industry, we take pride in delivering high-quality
              trousers, t-shirts, and leisurewear that blend style, comfort, and
              durability.
            </p>
            <p className="text-lg leading-relaxed">
              At Izole, we believe clothing is more than just fabric—it's a
              statement of individuality. Our collections cater to modern trends
              while ensuring a timeless appeal, making every outfit effortlessly
              stylish.
            </p>
            <p className="text-lg leading-relaxed">
              With a commitment to quality craftsmanship and authenticity, we
              source the finest fabrics and employ meticulous tailoring
              techniques to ensure every piece meets the highest standards.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-6">
            {[
              {
                icon: Award,
                title: "Quality First",
                desc: "Premium fabrics and exceptional craftsmanship in every piece",
              },
              {
                icon: ThumbsUp,
                title: "Customer Focus",
                desc: "Designed with your comfort and style preferences in mind",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "Quick and reliable shipping across India",
              },
              {
                icon: Users,
                title: "Community",
                desc: "Building relationships with our customers and community",
              },
            ].map(({ icon: Icon, title, desc }, index) => (
              <div
                key={index}
                className="bg-mustard rounded-lg p-6 flex flex-col items-center text-center"
              >
                <div className="bg-mustard p-3 rounded-full mb-4">
                  <Icon className="h-8 w-8 text-wineRed" />
                </div>
                <h4 className="font-bold text-wineRed text-xl mb-2">{title}</h4>
                <p className="opacity-80 text-wineRed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us section */}
        <div className="bg-mustard/10 rounded-xl p-8 lg:p-12 mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            Why Choose Izole?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Premium-quality fabrics",
                desc: "We source only the finest materials for exceptional comfort and durability.",
              },
              {
                title: "Trendy yet timeless designs",
                desc: "Fashion that stays relevant beyond seasonal trends.",
              },
              {
                title: "Comfort-driven styles",
                desc: "Clothing that feels as good as it looks, suitable for every occasion.",
              },
              {
                title: "Made with passion in Tirupur",
                desc: "Proudly crafted in India's textile hub with expert craftsmanship.",
              },
              {
                title: "Ethical manufacturing",
                desc: "Responsible production practices that respect our people and planet.",
              },
              {
                title: "Attention to detail",
                desc: "Meticulous finishing that ensures every garment meets our high standards.",
              },
            ].map(({ title, desc }, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="mt-1 bg-mustard text-wineRed p-1 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">{title}</h4>
                  <p className="opacity-80">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <p className="text-xl font-bold mb-6">
            Join us on our journey of fashion excellence and experience
            authentic clothing like never before!
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/customer/products"
              className="btn bg-mustard text-wineRed"
            >
              Shop Now
            </a>
            <a
              href="/customer#contact"
              className="btn border border-mustard text-mustard"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
