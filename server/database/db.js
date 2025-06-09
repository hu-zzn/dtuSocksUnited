import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "DTUsocksUNITED",
    }).then(() => {
        console.log(`Data Base dtuSocksUnited connected succsessfully`);
    }).catch((err) => {
        console.log(`error conecting to Data Base dtuSocksUnited ${err}`);
    });
}