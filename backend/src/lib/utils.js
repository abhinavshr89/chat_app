import jwt from "jsonwebtoken";


/**
 * Generates a JWT token for the given user ID and sets it as a cookie in the response.
 *
 * @param {string} userId - The ID of the user for whom the token is generated.
 * @param {Object} res - The response object to set the cookie.
 * @returns {string} The generated JWT token.
 *
 * @example
 * generateToken("user123", res);
 *
 * @description
 * The function generates a JWT token using the user ID and a secret key from the environment variables.
 * The token expires in 7 days.  It then sets the token as a cookie in the response with the following options:
 * - `httpOnly`: Ensures the cookie is only accessible via HTTP(S) and not client-side JavaScript.
 * - `maxAge`: Sets the cookie to expire in 7 days (in milliseconds).
 * - `sameSite`: Ensures the cookie is sent only with requests from the same site.
 * - `secure`: Ensures the cookie is sent only over HTTPS if the environment is not in development mode.
 */
const generateToken = (userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: "7d"
    });
    res.cookie("jwt",token,{
        httpOnly:true,
        maxAge: 7*24*60*60*1000,
        sameSite:"strict",
        secure: process.env.NODE_ENV !== "development"
    });
    return token;

}

export default generateToken;