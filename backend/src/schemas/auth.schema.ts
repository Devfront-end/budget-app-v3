import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Format email invalide'),
    username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères').max(30),
    password: z.string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
        .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Format email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
});
