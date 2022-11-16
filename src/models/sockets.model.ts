
import { Socket } from 'socket.io';
import { comprobarJWT } from '../helpers/jwt.helper';
import { addMessage, getAllUsers, userConnected, userDisconnected } from '../sockets/users.events';

export class Sockets {

    private readonly io: Socket;
    
    constructor( io: any ) {
        this.io = io;
    }


    handleEvents() {

        this.io.on('connection', async( socket: Socket ) => {

            // Validar accessToken
            const [ isValid, id ] = comprobarJWT( socket.handshake.query['Authorization'] as string );

            if ( !isValid ) {
                console.log('Socket no identificado')
                return socket.disconnect();
            }

            console.log('Cliente conectado', id )
            await userConnected( id as string )

            // Unir al usuario a su sala
            socket.join( id as string );


            // Escuchar mensaje personal 
            socket.on('personal-message', async( payload ) => {
                //Grabar mensaje en base de datos
                const message = await addMessage( payload )
                this.io.to( payload.to ).emit('personal-message', message);
                this.io.to( payload.from ).emit('personal-message', message);
            })


            // Emitir usuarios conectados a TODOS
            this.io.emit('list-users', await getAllUsers( id as string ));

            socket.on('disconnect', async ( reason ) => {
                console.log('Cliente desconectado', {id, reason})
                await userDisconnected( id as string )
                this.io.emit('list-users', await getAllUsers( id as string ));
            })
        })



    }
}