import { Request, Response } from "express";
import { prisma } from "../database/prisma";

//Cria os produtos a partir do nome, preço, quantidade e id da loja
export const createProduct = async (req: Request, res: Response) => {
  const { name, price, amount } = req.body;
  const { storeId } = req.params;

  const product = await prisma.product.create({
    data: { name, price, amount, Store: { connect: { id: storeId } } },
  });
  return res.json(product);
};

// Chama todos os produtos
export const getAllProduct = async (req: Request, res: Response) => {
  const productes = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      amount: true,
      Store: {
        select: {
          name: true,
        },
      },
    }
  });

  return res.json(productes);
};
