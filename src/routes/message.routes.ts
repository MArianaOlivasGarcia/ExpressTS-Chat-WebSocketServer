

import { Router } from 'express';
import { getChat } from '../controllers/messages.controllers';
import { verifyJwt } from '../middlewares/verify-jwt.middleware';

const router: Router = Router();

router.get('/:from', verifyJwt, getChat );



export default router;