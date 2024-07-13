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

// Serve para verificar se o acesso existe
    const isAccessName = await prisma.access.findUnique({
        where: {
            name: accessName
        } 
    });

// Se não exisir, ele retornará um erro
    if (!isAccessName) {
        return res.status(400).json({error: "Nível de acesso não existe"});
    }

    if (isUserEmail) {
        return res.status(400).json({error: "Email já existe"});
    }

// Criptografar a senha
    const hashPassword = await hash(password, 8);

// Criar o novo usuário
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            userAccess: { 
                create: {
                    Access: { 
                        connect: { 
                            name: accessName 
                        } 
                    }
                }
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            userAccess: {
                select: {
                    Access: { 
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });
    return res.json(user);
}

// Chamar todos os usuários
export const getAllUser = async (req: Request, res: Response) => {

    const  users = await prisma.user.findMany({

        select: {
            id: true,
            name: true,
            email: true,
            userAccess: {
                select: {
                    Access: { 
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });

    return res.json(users);
}

// Deletar todos os usuários existentes
export const deleteManyUser = async (req: Request, res: Response) => {

    await prisma.user.deleteMany();

    return res.json({message: "Usuários deletados"});
}
