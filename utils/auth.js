const {AuthenticationError}=require('apollo-server')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv");
dotenv.config();
const SECRET = process.env.JWT_SECRET;

module.exports = (context) => {
    const authHeader = context.req.headers.authorization
    if (authHeader) {
           const token = authHeader.split("Bearer ")[1];

           if (token) {
             try {
               const user = jwt.verify(token, SECRET);
               return user;
             } catch (error) {
               throw new AuthenticationError("Invalid/Expired token");
             }
           }
        
        throw new Error("Authorization token must be 'Bearer [token]'")
        
    }
       throw new Error("Authentication header must be provided..");
 
    
}