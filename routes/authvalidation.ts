import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

interface ICustomReq extends Request {
    user?: any;
}

interface ICustomRes {
    status:(code:number)=>Response
}

const Authvalidation = {

auth:(req: ICustomReq,res: ICustomRes,next: NextFunction) => {
    const token = req.headers.authorization;
  
    if (token) {
        try {
            const userVerified = jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret);
            req.user = userVerified;
            next()
        } catch (error) {
            res.status(401).send("Access Denied");
        }
    } 
}

}

export default Authvalidation;
