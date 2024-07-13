import { Request, Response } from "express";
import { prisma } from "../database/prisma";

// Criar um novo usuário
export const createStore = async (req: Request, res: Response) => {
   const { name } = req.body;
   const { userId } = req.params;

   const isUser = await prisma.user.findUnique({
      where: {
         id: userId
      }
   });

   if (!isUser) return res.status(400).json({ error: "Usuário inexistente" });

// Cria as lojas
   const store = await prisma.store.create({
      data: {
         name,
         User: {
            connect: {
               id: userId
            }
         }
      }
   });
   return res.json(store);
}

// Chama todas as lojas
export const getAllStore = async (req: Request, res: Response) => {

   const stores = await prisma.store.findMany({
      select: {
         id: true,
         name: true,
         User: {
            select: {
               name: true
            }
         },
         Product: {
            select: {
               name: true,
               price: true,
               amount: true

            }
         }
      }
   });

   return res.json(stores);
}
