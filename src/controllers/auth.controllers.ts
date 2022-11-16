
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, LoginUserDto } from '../dtos';
import { mapErrors } from '../helpers/map-errors.helper';
import { generedJWT } from '../helpers/jwt.helper';
import { RequestWithUserId } from '../interfaces/request.interface';
import { User } from '../entities/user.entity';

export const register = async ( req: Request, res: Response) => {
    
    const createUserDto = new CreateUserDto( req.body )

    const errors = await validate(createUserDto);

    if ( errors.length > 0 ) {
        return res.status(400).json({ 
            status: false,
            errors: mapErrors(errors) 
        })
    }


    try {

        const user = new User();
    
        const salt = bcrypt.genSaltSync();
        
        user.fullName = createUserDto.fullName;
        user.password = bcrypt.hashSync( createUserDto.password, salt );
        user.email = createUserDto.email;

        await user.save();

        delete user.password;

        const accessToken = await generedJWT( user.id! );

        res.status(200).json({
            status: true,
            user,
            accessToken
        }) 
    } catch (error) {
        handleExceptions(error, res);
    }

}



export const login = async ( req: Request, res: Response) => {

    const { email, password } = new LoginUserDto( req.body )

    const errors = await validate({ email, password });

    if ( errors.length > 0 ) {
        return res.status(400).json({ 
            status: false,
            errors: mapErrors(errors) 
        })
    }


    try {

        const user = await User.findOne({ email })


        if ( !user ) {
            return res.status(404).json({
                status: false,
                message: `User with email "${email}" not found`
            })
        }

        if ( !bcrypt.compareSync(password, user.password!) ) {
            return res.status(401).json({
                status: false,
                message: `Credentials are not valid.`
            })
        }

        delete user.password;

        const accessToken = await generedJWT( user.id! );

        res.status(200).json({
            status: true,
            user,
            accessToken
        }) 

    } catch (error) {
        handleExceptions(error, res);
    }

}



export const renew = async ( req: RequestWithUserId, res: Response) => {


    const id = req.id;

    const accessToken = await generedJWT( id! );

    const user = await User.findById(id);

    if ( !user ) {
        return res.status(404).json({
            status: false,
            message: `User with id "${ id }" not found`
        })
    }

    delete user?.password;

    res.json({
        status: true,
        user,
        accessToken
    }) 

}



const handleExceptions = ( error: any, res: Response ) => {
    if ( error.code == '23505' ) {
        return res.status(400).json({
            status: false,
            message: `${ error.detail }`
        })
    }

    console.log(error)

    return res.status(500).json({
        status: false,
        message: `Unexpected error, check server logs.`
    })
  }




