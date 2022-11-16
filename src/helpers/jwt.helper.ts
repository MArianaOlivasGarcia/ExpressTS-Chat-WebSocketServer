

import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../middlewares/verify-jwt.middleware';


export const generedJWT = ( id: string ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = { id };

        jwt.sign( payload, process.env.JWT_SEED!, {
            expiresIn: '4h'
        }, ( err, accessToken ) => {

            if ( err ) {
                console.log(err)
                reject('No se pudo generar el jsonwebtoken');
            }

            resolve( accessToken );
        })

    });

}



export const comprobarJWT = ( accessToken: string = '' ) => {

    try {

        const { id } = jwt.verify( accessToken.split(' ')[1], process.env.JWT_SEED! ) as JwtPayload;
        console.log(id)
        return [ true, id];
    } catch (error) {
        return [ false, null ]
    }

}