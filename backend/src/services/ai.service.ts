import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class AIService {
    private anthropic: Anthropic;

    constructor() {
        this.anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY || 'mock-key', // Fallback for safety, but real key needed for real calls
        });
    }

    async analyzeFinances(userId: string, question: string): Promise<string> {
        try {
            // 1. Gather Financial Context
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const currentMonthStr = today.toISOString().slice(0, 7);

            const [user, transactions, stats, debtRatio] = await Promise.all([
                prisma.user.findUnique({ where: { id: userId }, select: { firstName: true } }),
                prisma.transaction.findMany({
                    where: { userId, date: { gte: firstDayOfMonth } },
                    orderBy: { date: 'desc' },
                    take: 10
                }),
                prisma.budget.findUnique({
                    where: { userId_month: { userId, month: currentMonthStr } }
                }),
                prisma.debtRatio.findUnique({
                    where: { userId_month: { userId, month: currentMonthStr } }
                })
            ]);

            const income = stats?.totalIncome || 0;
            const expense = stats?.totalExpense || 0;
            const recentTx = transactions.map(t => `${t.date.toISOString().split('T')[0]}: ${t.description} (${t.amount}€) - ${t.type}`).join('\n');
            const debtStatus = debtRatio ? `Ratio Endettement: ${debtRatio.ratio}% (${debtRatio.status})` : 'Non calculé';

            // 2. Construct Prompt
            const systemPrompt = `Tu es un assistant financier expert, bienveillant et précis nommé "SmartBot". 
Ton but est d'aider l'utilisateur (${user?.firstName || 'utilisateur'}) à mieux gérer ses finances.
Réponds de manière concise, structurée (listes à puces si besoin) et en français.
Utilise les données financières fournies pour personnaliser tes conseils. 
Si la question n'est pas liée aux finances, ramène poliment le sujet vers le budget.`;

            const userContext = `
Données Financières du mois (${currentMonthStr}):
- Revenus budgetés: ${income}€
- Dépenses budgetées: ${expense}€
- Dernières transactions:
${recentTx}
- Santé financière: ${debtStatus}

Question de l'utilisateur: "${question}"
`;

            // 3. Call AI
            if (!process.env.ANTHROPIC_API_KEY) {
                // Mock response if no key
                return `[MODE DÉMO - Pas de clé API] 
Bonjour ${user?.firstName} ! D'après vos données (Revenus: ${income}€), voici une réponse simulée. 
Pour une vraie analyse, configurez ANTHROPIC_API_KEY.`;
            }

            const message = await this.anthropic.messages.create({
                model: "claude-3-haiku-20240307", // Faster/Cheaper model for chat
                max_tokens: 1024,
                system: systemPrompt,
                messages: [
                    { role: "user", content: userContext }
                ]
            });

            if (message.content[0].type === 'text') {
                return message.content[0].text;
            }
            return "Désolé, je n'ai pas pu analyser la réponse.";

        } catch (error) {
            logger.error('AI Service Error:', error);
            throw new Error('Erreur lors de l\'analyse IA');
        }
    }

    async categorizeTransaction(description: string, amount: number): Promise<{ category: string; merchant: string; confidence: number; tags: string[] }> {
        try {
            const systemPrompt = `Tu es un assistant expert en catégorisation bancaire.
Tâche : Analyser une transaction et retourner une catégorie standardisée, le nom propre du marchand, et des tags pertinents.
Format de réponse : JSON uniquement. Pas de texte avant ou après.
Catégories possibles : Alimentation, Restaurants, Logement, Transport, Loisirs, Santé, Shopping, Services, Revenus, Autre.`;

            const userPrompt = `Transaction: "${description}"
Montant: ${amount}€

Retourne un JSON avec :
- category (string)
- merchant (string, nom nettoyé)
- confidence (number, 0.0 à 1.0)
- tags (array of strings)

Exemple JSON:
{
  "category": "Restaurants",
  "merchant": "Uber Eats",
  "confidence": 0.95,
  "tags": ["livraison", "repas"]
}`;

            if (!process.env.ANTHROPIC_API_KEY) {
                // Mock response
                return {
                    category: 'Autre',
                    merchant: description,
                    confidence: 0.5,
                    tags: ['mock']
                };
            }

            const message = await this.anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 200,
                system: systemPrompt,
                messages: [{ role: "user", content: userPrompt }]
            });

            if (message.content[0].type === 'text') {
                const text = message.content[0].text;
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                return JSON.parse(text);
            }

            throw new Error('Invalid AI response');

        } catch (error) {
            logger.error('Categorization Error:', error);
            return {
                category: 'Autre',
                merchant: description,
                confidence: 0,
                tags: []
            };
        }
    }
}

export const aiService = new AIService();
