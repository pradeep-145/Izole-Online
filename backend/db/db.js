
const mongoose=require('mongoose');

const connectToDB=async ()=>{
    
    
    try{

        await  mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected");
    }   
    catch(error){
        console.log("Error in DB connection",error);
    }
}

module.exports=connectToDB;
