import axios from "axios";
import React, { useState } from "react";
import ReviewDialog from "../../Components/ReviewDialog";
const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    
  });
  
  const [images, setImages] = useState([]);
  const [color , setColor]=useState('')
  const [quantity, setQuantity] = useState(0);
  const getImageLink = async (image) => {

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "preset1"); // Replace with your Cloudinary preset
    formData.append("cloud_name", "dxuywp3zi");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxuywp3zi/image/upload",
        formData
      );
      
      return response.data.secure_url; // Cloudinary returns a secure URL
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const uploadedImages = await Promise.all(
        images.map(async (imageData) => {
            
          const uploadedImageLinks = await Promise.all(
            imageData.image.map(async (file) => await getImageLink(file))
          );
  
          return { color: imageData.color, image: uploadedImageLinks };
        })
      );
    try {
        const response=await axios.post('/api/products/save',{...formData,images:uploadedImages});
        console.log(response)
        setFormData({})
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-center font-serif my-8">Admin Dashboard</h1>
      <form className="flex flex-col justify-center border w-fit mx-auto p-5 gap-4">
        <input
          type="text"
          name="name"
          placeholder="name"
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="desc"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="price"
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
        />

        <div>
          <input type="text" name="colors" id="colors"
          onChange={(e)=>{
            setColor(e.target.value)
          }}
          placeholder="color" />
        <input
          type="number"
          name="quant"
          id="quant"
          placeholder="quant"
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />
          <button
            className="btn"
            disabled={color!=""&&formData.quantity!=""?false:true}
            onClick={(e) => {
              e.preventDefault();
              
              if (!color|| !quantity) return; // Prevent empty color addition

              setImages((prev) => [...prev, { color,quantity, image: [] }]);
              document.getElementById("colors").value = ""; // Clear input
            }}
          >
            Add color
          </button>

          {images.map((image, index) => (
            <div key={index}>
              <p>{image.color}</p>
              <p>{image.quantity}</p>
              <label htmlFor={`images-${index}`} className="custom-file-upload">
                +
              </label>

              <input
                type="file"
                id={`images-${index}`}
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const filesArray = e.target.files

                  setImages((prev) =>
                    prev.map((img, i) =>
                      i === index
                        ? { ...img, image: [...img.image, ...filesArray] }
                        : img
                    )
                  );
                }}
              />
    
              <div className="flex">
                {image.image.map((imgSrc, i) => 
                 
                  (
                  <img
                    key={i}
                    src={URL.createObjectURL(imgSrc)}
                    alt={`Preview ${i}`}
                    className="w-20 h-20 object-cover m-2"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-md"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(e)
          }}
        >
          Add
        </button>
      </form>
    </>
  );
};

export default AdminDashboard;
