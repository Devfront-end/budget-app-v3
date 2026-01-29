import api from './api';

export interface DebtRatioData {
    id?: string;
    month: string;
    monthlyIncome: number;
    monthlyDebts: number;
    ratio: number;
    status: 'GOOD' | 'ACCEPTABLE' | 'RISKY';
    createdAt?: string;
}

export interface DebtRatioCalculation {
    monthlyIncome: number;
    monthlyDebts: number;
    ratio: number;
    status: 'GOOD' | 'ACCEPTABLE' | 'RISKY';
    recommendation: string;
}

export const debtRatioService = {
    /**
     * Calcul du taux d'endettement selon les normes bancaires françaises
     * 
     * Formule : (Charges mensuelles / Revenus mensuels) × 100
     * 
     * Charges mensuelles incluent :
     * - Mensualités de crédit immobilier (assurance comprise)
     * - Mensualités de crédit à la consommation
     * - Pensions alimentaires versées
     * - Loyers (si applicable)
     * - Échéances 4X en cours
     * - Abonnements/souscriptions récurrentes
     * 
     * Revenus mensuels incluent :
     * - Salaires nets
     * - Pensions de retraite
     * - Revenus locatifs (si stables)
     * - Pensions alimentaires reçues
     * - Autres revenus réguliers
     * 
     * Seuils recommandés (HCSF 2022) :
     * - < 35% : ACCEPTABLE (seuil réglementaire maximum)
     * - 35-40% : LIMITE (dérogation possible selon profil)
     * - > 40% : RISQUE ÉLEVÉ (refus probable)
     * 
     * Note : La limite de 35% inclut l'assurance emprunteur
     */
    calculate: (monthlyIncome: number, monthlyDebts: number): DebtRatioCalculation => {
        if (monthlyIncome <= 0) {
            return {
                monthlyIncome,
                monthlyDebts,
                ratio: 0,
                status: 'RISKY',
                recommendation: 'Veuillez renseigner vos revenus mensuels pour calculer votre taux d\'endettement.'
            };
        }

        // Formule officielle : (Charges mensuelles / Revenus mensuels) × 100
        const ratio = (monthlyDebts / monthlyIncome) * 100;
        const roundedRatio = Math.round(ratio * 100) / 100; // 2 décimales

        let status: 'GOOD' | 'ACCEPTABLE' | 'RISKY';
        let recommendation: string;

        if (ratio < 35) {
            status = 'GOOD';
            recommendation = `Votre taux d'endettement de ${roundedRatio}% est conforme aux recommandations bancaires (< 35%). Vous disposez d'une capacité d'emprunt supplémentaire.`;
        } else if (ratio <= 40) {
            status = 'ACCEPTABLE';
            recommendation = `Votre taux d'endettement de ${roundedRatio}% dépasse légèrement le seuil réglementaire de 35%. Un nouveau crédit nécessitera l'accord exceptionnel de votre banque et dépendra de votre profil (revenus élevés, bonne gestion de compte, capacité d'épargne).`;
        } else {
            status = 'RISKY';
            recommendation = `Attention : votre taux d'endettement de ${roundedRatio}% est trop élevé (> 40%). Tout nouveau crédit sera très probablement refusé. Il est recommandé de réduire vos charges avant d'envisager un nouvel emprunt.`;
        }

        return {
            monthlyIncome,
            monthlyDebts,
            ratio: roundedRatio,
            status,
            recommendation
        };
    },

    /**
     * Calcul automatique des charges mensuelles
     * 
     * Agrège :
     * - Échéances 4X du mois en cours (non payées)
     * - Abonnements actifs (convertis en mensuel)
     * 
     * À ajouter manuellement par l'utilisateur :
     * - Crédits immobiliers
     * - Crédits à la consommation
     * - Pensions alimentaires versées
     * - Loyers éventuels
     */
    calculateMonthlyDebts: async (): Promise<number> => {
        try {
            let totalDebts = 0;

            // 1. Échéances 4X du mois en cours
            try {
                const installmentsResponse = await api.get<{
                    success: boolean;
                    data: Array<{ amount: number; dueDate: string }>;
                }>('/paiements-4x/current-month');

                if (installmentsResponse.data.success) {
                    totalDebts += installmentsResponse.data.data.reduce(
                        (sum, item) => sum + item.amount,
                        0
                    );
                }
            } catch (error) {
                console.error('Erreur récupération échéances 4X:', error);
            }

            // 2. Abonnements actifs (conversion en mensuel)
            try {
                const subscriptionsResponse = await api.get<{
                    success: boolean;
                    data: Array<{ amount: number; frequency: string }>;
                }>('/subscriptions/active');

                if (subscriptionsResponse.data.success) {
                    totalDebts += subscriptionsResponse.data.data.reduce((sum, sub) => {
                        let monthlyAmount = sub.amount;

                        // Conversion en montant mensuel
                        if (sub.frequency === 'YEARLY') {
                            monthlyAmount = sub.amount / 12;
                        } else if (sub.frequency === 'QUARTERLY') {
                            monthlyAmount = sub.amount / 3;
                        }
                        // 'MONTHLY' reste inchangé

                        return sum + monthlyAmount;
                    }, 0);
                }
            } catch (error) {
                console.error('Erreur récupération abonnements:', error);
            }

            return Math.round(totalDebts * 100) / 100;
        } catch (error) {
            console.error('Erreur calcul charges mensuelles:', error);
            return 0;
        }
    },

    /**
     * Récupérer le dernier calcul enregistré
     */
    getLatest: async () => {
        const response = await api.get<{ success: boolean; data: DebtRatioData }>('/debt-ratio/latest');
        return response.data.data;
    },

    /**
     * Récupérer l'historique (6 derniers mois)
     */
    getHistory: async () => {
        const response = await api.get<{ success: boolean; data: DebtRatioData[] }>('/debt-ratio/history');
        return response.data.data;
    },

    /**
     * Enregistrer ou mettre à jour le calcul du mois en cours
     */
    update: async (data: { monthlyIncome: number; monthlyDebts: number }) => {
        const calculation = debtRatioService.calculate(data.monthlyIncome, data.monthlyDebts);

        const response = await api.post<{ success: boolean; data: DebtRatioData }>('/debt-ratio', {
            ...data,
            ratio: calculation.ratio,
            status: calculation.status
        });

        return response.data.data;
    },

    /**
     * Calcul et enregistrement automatiques
     */
    autoUpdate: async (monthlyIncome: number) => {
        const monthlyDebts = await debtRatioService.calculateMonthlyDebts();
        return debtRatioService.update({ monthlyIncome, monthlyDebts });
    },

    /**
     * Helpers pour l'affichage UI
     */
    getStatusColor: (status: 'GOOD' | 'ACCEPTABLE' | 'RISKY'): string => {
        const colors = {
            GOOD: '#10b981',       // green-500
            ACCEPTABLE: '#f59e0b', // amber-500
            RISKY: '#ef4444'       // red-500
        };
        return colors[status];
    },

    getStatusEmoji: (status: 'GOOD' | 'ACCEPTABLE' | 'RISKY'): string => {
        const emojis = {
            GOOD: '✅',
            ACCEPTABLE: '⚠️',
            RISKY: '🚨'
        };
        return emojis[status];
    },

    getStatusLabel: (status: 'GOOD' | 'ACCEPTABLE' | 'RISKY'): string => {
        const labels = {
            GOOD: 'Sain',
            ACCEPTABLE: 'Limite acceptable',
            RISKY: 'Trop élevé'
        };
        return labels[status];
    },

    /**
     * Calcul de la capacité d'emprunt résiduelle
     * Basé sur le seuil réglementaire de 35%
     */
    calculateRemainingCapacity: (monthlyIncome: number, currentDebts: number): number => {
        const maxAllowedDebts = monthlyIncome * 0.35; // 35% des revenus
        const remainingCapacity = maxAllowedDebts - currentDebts;
        return Math.max(0, Math.round(remainingCapacity * 100) / 100);
    }
};
