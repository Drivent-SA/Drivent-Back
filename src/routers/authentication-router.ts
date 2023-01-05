import { logInWithOauthPost, singInPost } from "@/controllers";
import { validateBody } from "@/middlewares";
import { logInOauthSchema, signInSchema } from "@/schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post("/sign-in", validateBody(signInSchema), singInPost).post("/oauth", validateBody(logInOauthSchema), logInWithOauthPost);

export { authenticationRouter };
