import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { transactionService } from '../../services/transactionService';
import { categoryService } from '../../services/categoryService';
import { bankAccountService } from '../../services/bankAccountService';
// import api from '../../services/api'; // Not directly needed if using services

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

  const handleRestoreDefaults = async () => {
    try {
      setLoading(true);
      await categoryService.initDefaults();
      await loadCategoriesAndAccounts();
    } catch (err) {
      console.error('Failed to restore defaults', err);
    } finally {
      setLoading(false);
    }
  };

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
      const [categoriesData, accountsData] = await Promise.all([
        categoryService.getCategories().catch(err => {
          console.error("Failed to load categories", err);
          return { data: { categories: [] } };
        }),
        bankAccountService.getAccounts().catch(err => {
          console.error("Failed to load accounts", err);
          return { data: { accounts: [] } };
        }),
      ]);

      setCategories(categoriesData.data?.categories || []);
      setAccounts(accountsData.data?.accounts || []);
    } catch (err: any) {
      console.error('Erreur chargement données:', err);
      setError(`Erreur de chargement: ${err.message || 'Unknown error'}`);
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
              Dépense
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME' }))}
              className={`py-3 px-4 rounded-2xl font-medium transition-all ${formData.type === 'INCOME'
                ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg'
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                }`}
            >
              Revenu
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
            placeholder="Ex: Salaire de janvier"
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
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Catégorie <span className="text-gray-400">(optionnel)</span>
            </label>
            {_categories.length === 0 && (
              <button
                type="button"
                onClick={handleRestoreDefaults}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium underline"
              >
                Restaurer les catégories
              </button>
            )}
          </div>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="input-premium"
          >
            <option value="">Aucune catégorie</option>
            {_categories
              .filter(cat => cat.type === formData.type)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
          {_categories.filter(cat => cat.type === formData.type).length === 0 && _categories.length > 0 && (
            <p className="text-xs text-warning-600 mt-1">
              Aucune catégorie '{(formData.type === 'INCOME' ? 'Revenu' : 'Dépense')}' trouvée.
            </p>
          )}
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
