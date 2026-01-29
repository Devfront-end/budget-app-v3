import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dashboardService } from '../services/dashboardService';
import { transactionService } from '../services/transactionService';
import {
  BalanceCard,
  GlassCard,
  FABButton,
  TransactionItem,
  StatsCard,
  SkeletonCard,
} from '../components/ui/PremiumComponents';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  PlusIcon,
  ChartBarIcon,
  CreditCardIcon,
  TrophyIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { AddTransactionModal } from '../components/features/AddTransactionModal';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [changes, setChanges] = useState({ income: 0, expense: 0, balance: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [showTransactions, setShowTransactions] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryData, transactionsData] = await Promise.all([
        dashboardService.getSummary('month'),
        dashboardService.getRecentTransactions(5)
      ]);

      if (summaryData.success && summaryData.data.summary) {
        setBalance(summaryData.data.summary.balance);
        setIncome(summaryData.data.summary.totalIncome);
        setExpenses(summaryData.data.summary.totalExpense);
        setChanges(summaryData.data.summary.changes || { income: 0, expense: 0, balance: 0 });
      }

      if (transactionsData.success && transactionsData.data.transactions) {
        setTransactions(transactionsData.data.transactions.map((t: any) => ({
          id: t.id,
          icon: t.category?.icon || '💸',
          title: t.description,
          date: new Date(t.date).toLocaleDateString(),
          amount: Number(t.amount),
          type: t.type,
          color: t.category?.color || '#cbd5e1',
          categoryId: t.categoryId,
          bankAccountId: t.bankAccountId,
          description: t.description,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleEdit = (transaction: any) => {
    setEditingTransaction({
      ...transaction,
      date: new Date().toISOString()
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        await transactionService.delete(id);
        fetchDashboardData();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="p-6 pb-24 max-w-7xl mx-auto">
        <SkeletonCard />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-6 pb-24 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Bonjour 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Voici votre résumé financier</p>
        </motion.div>

        {/* Balance Card */}
        <BalanceCard balance={balance} className="mb-8" />

        {/* Quick Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <motion.div variants={item}>
            <StatsCard
              title="Revenus ce mois"
              value={income.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              change={changes.income}
              icon={<ArrowTrendingUpIcon className="w-8 h-8" />}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatsCard
              title="Dépenses ce mois"
              value={expenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              change={changes.expense}
              icon={<ArrowTrendingDownIcon className="w-8 h-8" />}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatsCard
              title="Solde"
              value={(income - expenses).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              change={changes.balance}
              icon={<BanknotesIcon className="w-8 h-8" />}
            />
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <GlassCard className="mb-8">
          <h2 className="text-xl font-bold mb-6">Actions rapides</h2>
          <div className="flex gap-6 justify-around">
            <FABButton icon={<PlusIcon className="w-8 h-8" />} label="Ajouter" onClick={() => { setEditingTransaction(null); setShowAddModal(true); }} />
            <FABButton icon={<ChartBarIcon className="w-8 h-8" />} label="Statistiques" onClick={() => navigate('/analytics')} variant="success" />
            <FABButton icon={<CreditCardIcon className="w-8 h-8" />} label="Comptes" onClick={() => alert('Voir comptes')} />
            <FABButton icon={<TrophyIcon className="w-8 h-8" />} label="Objectifs" onClick={() => alert('Voir objectifs')} />
          </div>
        </GlassCard>


        {/* Recent Transactions */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ClockIcon className="w-6 h-6 text-primary-600" />
              Transactions récentes
            </h2>
            <div className="flex items-center gap-4">
              <Link to="/transactions" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Voir tout →
              </Link>
              <button
                onClick={() => setShowTransactions(!showTransactions)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={showTransactions ? "Masquer les transactions" : "Afficher les transactions"}
              >
                {showTransactions ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {showTransactions && (
            <div className="space-y-3 pt-2">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  {...transaction}
                  onEdit={() => handleEdit(transaction)}
                  onDelete={() => handleDelete(transaction.id)}
                />
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        transaction={editingTransaction}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
}

export default Dashboard;
