import { Router } from "express";
import {
  createUser,
  deleteManyUser,
  getAllUser,
  getUniqueUser,
} from "./controller/UserController";
import { createAccess, getAllAccesses } from "./controller/AccessController";
import { createStore, deleteAllStore, getAllStore } from "./controller/StoreController";
import { createProduct, getAllProduct } from "./controller/ProductController";
import { signIN } from "./controller/SessionController";
import { authMiddleware } from "./middlewares/AuthMiddleware";

export const router = Router();

//Usuário
router.post("/user", createUser);
router.delete("/delete-users", authMiddleware(["adm"]), deleteManyUser);
router.get("/users", authMiddleware(["adm"]), getAllUser);
router.get(
  "/unique-user",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  getUniqueUser
);

//Níveis de acesso
router.post("/access", authMiddleware(["adm"]), createAccess);
router.get("/accesses", authMiddleware(["adm", "Vendedor"]), getAllAccesses);

//Gerenciamento das Lojas
router.post("/store", authMiddleware(["adm", "Vendedor"]), createStore);
router.get("/stores", getAllStore);
router.delete("/delete-stores", authMiddleware(["adm"]), deleteAllStore);

//Produtos
router.post(
  "/product/:storeId",
  authMiddleware(["adm", "Vendedor"]),
  createProduct
);
router.get(
  "/products",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  getAllProduct
);

//Sessão
router.post("/sing-in", signIN);
