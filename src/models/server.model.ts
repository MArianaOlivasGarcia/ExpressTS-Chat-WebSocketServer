

import express, { Express } from 'express';
import http from 'http';
import path from 'path';
import { Server as WSServer } from 'socket.io';
import { Sockets } from './sockets.model';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors'
import { dbConnection } from '../database/config';

// Rutas
import authRoutes from '../routes/auth.routes'
import messageRoutes from '../routes/message.routes'

export class Server {

    private readonly app: Express = express();
    private readonly port: number = +process.env.PORT!;
    private readonly server = http.createServer( this.app );    
    private readonly io = new WSServer( this.server )


    constructor() {}


    middlewares() {

        // this.app.use(morgan('dev'))

        // Habilitar CORS
        this.app.use(cors())

        // Parseo del body
        // this.app.use( express.json() );
        this.app.use(bodyParser.json())

        // Habilitar rutas
        this.app.use( '/api/auth', authRoutes);
        this.app.use( '/api/messages', messageRoutes);
        this.app.use( express.static( path.resolve( __dirname, '../public') ) );
    }

    init() {

        dbConnection();

        // Inicializar middlewares
        this.middlewares();

        // Inicializar sockets
        const sockets = new Sockets( this.io )
        sockets.handleEvents();

        // Inicializar servidor
        this.server.listen( this.port, () => {
            console.log(`Servidor corriendo en el puerto: ${ this.port }`)
        })
    }

}