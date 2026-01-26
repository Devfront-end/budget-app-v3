import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { transactionService } from '../../services/transactionService';
import api from '../../services/api';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  transaction?: any; // Transaction à modifier (optionnel)
}

export const AddTransactionModal = ({ isOpen, onClose, onSuccess, transaction }: AddTransactionModalProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    description: '',
    categoryId: '',
    bankAccountId: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [_categories, setCategories] = useState<any[]>([]);
  const [_accounts, setAccounts] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCategoriesAndAccounts();
      if (transaction) {
        // Pré-remplir le formulaire pour modification
        setFormData({
          amount: transaction.amount.toString(),
          type: transaction.type,
          description: transaction.description,
          categoryId: transaction.categoryId || '',
          bankAccountId: transaction.bankAccountId || '',
          date: new Date(transaction.date).toISOString().split('T')[0],
        });
      } else {
        // Reset pour nouvelle transaction
        setFormData({
          amount: '',
          type: 'EXPENSE',
          description: '',
          categoryId: '',
          bankAccountId: '',
          date: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [isOpen, transaction]);

  const loadCategoriesAndAccounts = async () => {
    try {
      // Charger les catégories et comptes
      const [categoriesRes, accountsRes] = await Promise.all([
        api.get('/categories').catch(() => ({ data: { data: { categories: [] } } })),
        api.get('/bank-accounts').catch(() => ({ data: { data: { accounts: [] } } })),
      ]);

      setCategories(categoriesRes.data?.data?.categories || []);
      setAccounts(accountsRes.data?.data?.accounts || []);
    } catch (err) {
      console.error('Erreur chargement données:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }
    if (!formData.description.trim()) {
      setError('La description est requise');
      return;
    }

    setLoading(true);

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId || null,
        bankAccountId: formData.bankAccountId || null,
      };

      if (transaction) {
        await transactionService.update(transaction.id, data);
      } else {
        await transactionService.create(data);
      }

      // Succès
      onSuccess?.();
      onClose();

      // Reset form handled by useEffect
    } catch (error: any) {
      console.error('Erreur sauvegarde transaction:', error);
      setError(error.response?.data?.error?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={transaction ? "Modifier Transaction" : "Nouvelle Transaction"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Erreur */}
        {error && (
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        {/* Type de transaction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type de transaction
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'EXPENSE' }))}
              className={`py-3 px-4 rounded-2xl font-medium transition-all ${formData.type === 'EXPENSE'
                ? 'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-lg'
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                }`}
            >
              💸 Dépense
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME' }))}
              className={`py-3 px-4 rounded-2xl font-medium transition-all ${formData.type === 'INCOME'
                ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg'
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                }`}
            >
              💰 Revenu
            </button>
          </div>
        </div>

        {/* Montant */}
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            className="input-premium"
            placeholder="Ex: Courses Carrefour"
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="input-premium"
          />
        </div>

        {/* Catégorie (optionnel) */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Catégorie <span className="text-gray-400">(optionnel)</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="input-premium"
          >
            <option value="">Aucune catégorie</option>
            {_categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Compte bancaire (optionnel) */}
        <div>
          <label htmlFor="bankAccountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Compte <span className="text-gray-400">(optionnel)</span>
          </label>
          <select
            id="bankAccountId"
            name="bankAccountId"
            value={formData.bankAccountId}
            onChange={handleChange}
            className="input-premium"
          >
            <option value="">Aucun compte</option>
            {_accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
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
            className={`flex-1 ${formData.type === 'INCOME' ? 'btn-success' : 'btn-danger'}`}
          >
            {loading ? 'Enregistrement...' : (transaction ? 'Sauvegarder' : 'Ajouter')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
