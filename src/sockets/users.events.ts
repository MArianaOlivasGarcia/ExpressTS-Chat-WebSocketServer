import { Message } from "../entities/message.entity";
import { User } from "../entities/user.entity"



export const userConnected = async ( id: string ) => {
    
    const user = await User.findById(id);

    if ( ! user ) return null;

    user.isOnline = true;

    await user.save();

    return user;
}




export const userDisconnected = async ( id: string ) => {
    
    const user = await User.findById(id);

    if ( ! user ) return null;

    user.isOnline = false;

    await user.save();

    return user;
}


export const getAllUsers = async ( id: string ) => {

    const users = await User.find({
        _id: { $ne: id },
        order: {
            isOnline: "DESC", 
        }
    });

    return users;

}


export const addMessage = async ( payload: any ) => {
    try {
        
        const message = new Message( payload );
        await message.save();

        return message;

    } catch (error) {
        console.log(error);
        return false;
    }
}