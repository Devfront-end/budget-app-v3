import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { subscriptionService } from '../../services/subscriptionService';

interface AddSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    subscription?: any;
}

export const AddSubscriptionModal = ({ isOpen, onClose, onSuccess, subscription }: AddSubscriptionModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        frequency: 'MONTHLY' as 'WEEKLY' | 'MONTHLY' | 'YEARLY',
        category: 'General',
        nextRenewal: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (subscription) {
                setFormData({
                    name: subscription.name,
                    amount: subscription.amount.toString(),
                    frequency: subscription.frequency,
                    category: subscription.category,
                    nextRenewal: new Date(subscription.nextRenewal).toISOString().split('T')[0],
                });
            } else {
                setFormData({
                    name: '',
                    amount: '',
                    frequency: 'MONTHLY',
                    category: 'General',
                    nextRenewal: new Date().toISOString().split('T')[0],
                });
            }
        }
    }, [isOpen, subscription]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Le nom est requis');
            return;
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Le montant doit être supérieur à 0');
            return;
        }

        setLoading(true);

        try {
            const data = {
                ...formData,
                amount: parseFloat(formData.amount),
            };

            if (subscription) {
                await subscriptionService.update(subscription.id, data);
            } else {
                await subscriptionService.create(data);
            }

            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Erreur sauvegarde abonnement:', error);
            setError('Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={subscription ? "Modifier Abonnement" : "Nouvel Abonnement"}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-2xl">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom du service
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input-premium"
                        placeholder="Netflix, Spotify..."
                    />
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Montant (€)
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        step="0.01"
                        required
                        value={formData.amount}
                        onChange={handleChange}
                        className="input-premium"
                        placeholder="0,00"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Fréquence
                        </label>
                        <select
                            id="frequency"
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            className="input-premium"
                        >
                            <option value="WEEKLY">Hebdomadaire</option>
                            <option value="MONTHLY">Mensuel</option>
                            <option value="YEARLY">Annuel</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Catégorie
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="input-premium"
                            placeholder="Divertissement"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="nextRenewal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prochain paiement
                    </label>
                    <input
                        type="date"
                        id="nextRenewal"
                        name="nextRenewal"
                        required
                        value={formData.nextRenewal}
                        onChange={handleChange}
                        className="input-premium"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="btn-secondary flex-1"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
                    >
                        {loading ? 'Enregistrement...' : (subscription ? 'Sauvegarder' : 'Ajouter')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
