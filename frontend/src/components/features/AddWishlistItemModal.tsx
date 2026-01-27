import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { wishlistService } from '../../services/wishlistService';

interface AddWishlistItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    item?: any;
}

export const AddWishlistItemModal = ({ isOpen, onClose, onSuccess, item }: AddWishlistItemModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentSavings: '0',
        category: 'General',
        priority: '0',
        targetDate: '',
        imageUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (item) {
                setFormData({
                    name: item.name,
                    targetAmount: item.targetAmount.toString(),
                    currentSavings: item.currentSavings.toString(),
                    category: item.category,
                    priority: item.priority.toString(),
                    targetDate: item.targetDate ? new Date(item.targetDate).toISOString().split('T')[0] : '',
                    imageUrl: item.imageUrl || '',
                });
            } else {
                setFormData({
                    name: '',
                    targetAmount: '',
                    currentSavings: '0',
                    category: 'General',
                    priority: '0',
                    targetDate: '',
                    imageUrl: '',
                });
            }
        }
    }, [isOpen, item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Le nom est requis');
            return;
        }
        if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
            setError("L'objectif doit être supérieur à 0");
            return;
        }

        setLoading(true);

        try {
            const data = {
                ...formData,
                targetAmount: parseFloat(formData.targetAmount),
                currentSavings: parseFloat(formData.currentSavings || '0'),
                priority: parseInt(formData.priority),
                targetDate: formData.targetDate || null,
            };

            if (item) {
                await wishlistService.update(item.id, data);
            } else {
                await wishlistService.create(data);
            }

            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Erreur sauvegarde wishlist:', error);
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
        <Modal isOpen={isOpen} onClose={onClose} title={item ? "Modifier Objectif" : "Nouvel Objectif"}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-2xl">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom de l'objectif
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input-premium"
                        placeholder="Nouvelle voiture, Voyage..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Objectif (€)
                        </label>
                        <input
                            type="number"
                            id="targetAmount"
                            name="targetAmount"
                            step="0.01"
                            required
                            value={formData.targetAmount}
                            onChange={handleChange}
                            className="input-premium"
                            placeholder="0,00"
                        />
                    </div>
                    <div>
                        <label htmlFor="currentSavings" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Déjà épargné (€)
                        </label>
                        <input
                            type="number"
                            id="currentSavings"
                            name="currentSavings"
                            step="0.01"
                            value={formData.currentSavings}
                            onChange={handleChange}
                            className="input-premium"
                            placeholder="0,00"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                            placeholder="Général"
                        />
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Priorité (0-10)
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="input-premium"
                        >
                            {[0, 1, 2, 3, 4, 5].map(p => (
                                <option key={p} value={p}>{p} {p === 5 ? '(Haute)' : p === 0 ? '(Basse)' : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date cible (optionnel)
                    </label>
                    <input
                        type="date"
                        id="targetDate"
                        name="targetDate"
                        value={formData.targetDate}
                        onChange={handleChange}
                        className="input-premium"
                    />
                </div>

                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        URL Image (optionnel)
                    </label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="input-premium"
                        placeholder="https://..."
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
                        {loading ? 'Enregistrement...' : (item ? 'Sauvegarder' : 'Ajouter')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
