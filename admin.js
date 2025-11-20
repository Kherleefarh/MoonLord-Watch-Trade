import express from 'express';
import prisma from '../lib/prisma.js';
import { getUserFromReq } from '../lib/auth.js';

const router = express.Router();

async function requireAdmin(req,res,next){
  const user = await getUserFromReq(req);
  if(!user || user.role !== 'ADMIN') return res.status(403).json({ error:'Admin only' });
  req.user = user;
  next();
}

router.get('/stats', requireAdmin, async (req,res)=>{
  const users = await prisma.user.count();
  const listings = await prisma.listing.count();
  const messages = await prisma.message.count();
  res.json({ users, listings, messages });
});

router.post('/ban-user/:id', requireAdmin, async (req,res)=>{
  const id = req.params.id;
  await prisma.user.update({ where:{ id }, data:{ banned: true } });
  res.json({ ok:true });
});

export default router;
