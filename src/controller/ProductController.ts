import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const createProduct = async (req: Request, res: Response) => {
    const { name, price, amount } = req.body;
    const { storeId } = req.params

    const product = await prisma.product.create({
        data: { name , price, amount, Store: { connect: { id: storeId } } },
    });
    return res.json(product);
}

export const getAllProduct = async (req: Request, res: Response) => {

    const productes = await prisma.access.findMany()

    return res.json(productes);
}