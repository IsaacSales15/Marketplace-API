import { Router } from "express";
import { createUser, deleteManyUser, getAllUser } from "./controller/UserController";
import { createAccess, getAllAccesses } from "./controller/AccessController";
import { createStore, getAllStore } from "./controller/StoreController";
import { createProduct } from "./controller/ProductController";
import { signIN } from "./controller/SessionController";
import { authMiddleware } from "./middlewares/AuthMiddleware";

export const router = Router();

//Usuário
router.post("/user", createUser);
router.delete("/delete-users", deleteManyUser);
router.get("/users", getAllUser);

//Níveis de acesso
router.post("/access", createAccess);
router.get("/accesses", authMiddleware(["adm"]), getAllAccesses);

//Gerenciamento das Lojas
router.post("/store/:userId", createStore);
router.get("/stores", getAllStore);

//Produtos
router.post("/product/:storeId", createProduct);

//Sessão
router.post("/sing-in", signIN);