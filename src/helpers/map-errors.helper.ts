import { ValidationError } from "class-validator";


export const mapErrors = ( errors: ValidationError[] ) => {

    let errorConstraints: string[] = [];

    errors.forEach( err => {
        for (const key in err.constraints) {
            errorConstraints.push( err.constraints[key] )
        }
    })

    return errorConstraints;
}