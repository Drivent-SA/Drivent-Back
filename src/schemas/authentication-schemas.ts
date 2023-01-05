import { SignInParams } from "@/services";
import Joi from "joi";

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const logInOauthSchema = Joi.object<logInOauthSchema>({
  email: Joi.string().email().required()
});

type logInOauthSchema = {
  email: string
}
