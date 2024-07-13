import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export const signIN = async (req: Request, res: Response) => {
    try {
        
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
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
        })

        if(!user) {
            return res.status(400).json({error: "Usuário não encontrado"});
        }

        const isPasswordValid = await compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(400).json({error: "Senha inválida"});
        }

        const MY_SECRET_KEY = process.env.MY_SECRET_KEY;

        if (!MY_SECRET_KEY) {
            throw new Error('Chave de segurança ausente');
        }

        const token = sign({
            userId: user.id, roles: user.userAccess.map(role => role.Access?.name)
        }, MY_SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: "1h"
        })

        return res.status(200).json({ token });

    } catch (error) {
        // Minha vontade de fazer piadas no código voltou
        return res.status(400).json("Deu muito errado ai, filhão");
    }
}