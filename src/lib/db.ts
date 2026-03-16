import mongoose from "mongoose";

const MONGO_URI= process.env.MONGO_URI;

export const connectDB = async () => {
    try{
        if(mongoose.connection.readyState === 1){
            return;
        }
        if (!MONGO_URI) {
            console.error("MONGO_URI is not set");
            process.exit(1);
        }
        await mongoose.connect(MONGO_URI);
        console.log("🟢Connected to MongoDB");
    }catch(error){
        console.error(error);
        process.exit(1);
    }
}