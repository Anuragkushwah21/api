const express = require("express");
const app = express();
const dotenv=require("dotenv")
dotenv.config({path:"./.env"})
const web=require("./routes/web")
const connectDb=require("./db/connectdb")
const cookieParser=require('cookie-parser')
const cors=require("cors")


app.use(cors()) //for api communication in react
//file upload
const fileupload=require('express-fileupload')
//file upload
app.use(fileupload({useTempFiles:true}))
//token get
app.use(cookieParser());

//for dataget for api
app.use(express.json())

connectDb()


//load route 
app.use('/api',web)
//localhost:3300/api ye hmesha common rhega


 



//create server
app.listen(process.env.PORT, () => {
  console.log(`start is succesfully localhost:${process.env.PORT}`);
});
