import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { hash } from "bcryptjs";

// Criar um novo usuário
export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, accessName } = req.body;

    const isUserEmail = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (isUserEmail) {
        return res.status(400).json({error: "Email já existe"});
    }

    const hashPassword = await hash(password, 8);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            Access: { 
                connect: {
                    name: accessName
                }
            }
        }
    });
    return res.json(user);
}

// Deletar todos os usuários existentes
export const deleteManyUser = async (req: Request, res: Response) => {

    await prisma.user.deleteMany();

    return res.json({message: "Usuários deletados"});
}