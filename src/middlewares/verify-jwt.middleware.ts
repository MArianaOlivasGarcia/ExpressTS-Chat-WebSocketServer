


import { Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestWithUserId } from '../interfaces/request.interface';

export interface JwtPayload {
    id: string
}

export const verifyJwt = (req: RequestWithUserId, res: Response, next: NextFunction ) => {


    try {
        
        if ( !req.headers['authorization'] ) {
            return res.status(401).json({
                    status: false,
                    message: 'No hay accessToken'
                })
        }

        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const accessToken = bearerToken[1]

        const { id } = jwt.verify( accessToken, process.env.JWT_SEED! ) as JwtPayload;

        req.id = id;

        next();

    } catch (error) {
        res.status(401).json({
            status: false,
            message: 'Token inválido.'
        })
    }

}