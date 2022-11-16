

import { Request } from 'express';

export interface RequestWithUserId extends Request {
    id?: string
}