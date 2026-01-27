import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import { transactionService } from '../services/transactionService';
import AddTransactionModal from '../components/features/AddTransactionModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getAll({ limit: 50 }); // Fetch last 50 by default
      if (response.success && response.data) {
        setTransactions(response.data.transactions);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
      setError('Impossible de charger les transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        await transactionService.delete(id);
        fetchTransactions();
      } catch (err) {
        console.error('Failed to delete transaction', err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleModalSuccess = () => {
    fetchTransactions();
    // Modal will be closed by the component itself calling onClose, 
    // but usually we might want to close it here if the modal doesn't handle it.
    // The AddTransactionModal calls onClose() after success, so we just need to refresh.
  };

  const formatCurrency = (amount: number, type: string) => {
    const isExpense = type === 'EXPENSE';
    const sign = isExpense ? '-' : '+';
    const color = isExpense ? 'text-danger-600' : 'text-success-600';
    return (
      <span className={`font-medium ${color}`}>
        {sign}{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Transactions</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Gérez vos revenus et dépenses</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvelle Transaction
        </button>
      </div>

      {/* Filters & Search (Simplified for now) */}
      <div className="card p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="input-premium pl-10 w-full"
          />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter size={20} />
          Filtres
        </button>
      </div>

      {/* Transactions List */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : error ? (
          <div className="p-8 text-center text-danger-500">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Aucune transaction</h3>
            <p className="text-gray-500 mt-2">Commencez par ajouter votre première dépense ou revenu.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Compte</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {format(new Date(t.date), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl" role="img" aria-label="icon">
                          {t.category?.icon || '📦'}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {t.category?.name || 'Sans catégorie'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {t.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t.bankAccount?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {formatCurrency(Number(t.amount), t.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(t)}
                        className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 mr-3"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-danger-600 hover:text-danger-900 dark:hover:text-danger-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        transaction={editingTransaction}
      />
    </div>
  );
}

export default Transactions;
