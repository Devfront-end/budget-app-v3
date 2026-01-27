import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { categoryService } from '../../services/categoryService';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const AddCategoryModal = ({ isOpen, onClose, onSuccess }: AddCategoryModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        icon: '📁',
        color: '#6B7280',
        type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await categoryService.createCategory(formData);
            onSuccess?.();
            onClose();
            // Reset defaults
            setFormData({
                name: '',
                icon: '📁',
                color: '#6B7280',
                type: 'EXPENSE',
            });
        } catch (err: any) {
            console.error('Failed to create category:', err);
            setError(err.response?.data?.error?.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle Catégorie">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-2xl">
                        {error}
                    </div>
                )}

                {/* Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                            className={`py-3 px-4 rounded-2xl font-medium transition-all ${formData.type === 'EXPENSE'
                                    ? 'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-lg'
                                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            Dépense
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                            className={`py-3 px-4 rounded-2xl font-medium transition-all ${formData.type === 'INCOME'
                                    ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg'
                                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            Revenu
                        </button>
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-premium"
                        placeholder="Ex: Alimentation"
                    />
                </div>

                {/* Icon & Color (Simple inputs for now) */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Icône (Emoji)
                        </label>
                        <input
                            type="text"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="input-premium text-center text-2xl"
                            maxLength={2}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Couleur
                        </label>
                        <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-full h-12 rounded-2xl cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button type="button" onClick={onClose} className="btn-secondary flex-1">
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex-1"
                    >
                        {loading ? 'Création...' : 'Valider'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
