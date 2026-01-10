import express from "express" ; 
import morgan from "morgan" ;
import cors from "cors" ;
import helmet from "helmet" ;
import rateLimit from "express-rate-limit" ;
import dotenv from "dotenv" ;

import swaggerUi from "swagger-ui-express" ;
import { swaggerSpecs } from "./config/swagger.js" ;


import authRoutes from "./routes/auth.routes.js" ;
import postRoutes from "./routes/post.routes.js" ;  
const app = express() ; 

dotenv.config() ;


app.use(helmet()) ;
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://blog-name.netlify.app/",
      "https://blog-app-1-bvsu.onrender.com/"
    ],
    credentials: true,
  })) ;
app.use(express.json()) ;

// Routes
app.use("/api/auth", authRoutes);  
app.use("/api/posts", postRoutes); 
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));



app.get("/", (req, res) => {
    res.send("API is running...") ;
}) ;


export default app ;