import "reflect-metadata";
import { Server } from "./models/server.model";
import dotnet from 'dotenv';
dotnet.config()



new Server().init();