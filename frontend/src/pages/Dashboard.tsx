import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardService } from '../services/dashboardService';
import {
  BalanceCard,
  GlassCard,
  FABButton,
  TransactionItem,
  StatsCard,
  SkeletonCard,
} from '../components/ui/PremiumComponents';
import { AddTransactionModal } from '../components/features/AddTransactionModal';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
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
        }

        if (transactionsData.success && transactionsData.data.transactions) {
          // Map API transactions to UI format if necessary
          setTransactions(transactionsData.data.transactions.map((t: any) => ({
            id: t.id,
            icon: t.category?.icon || '💸', // Default icon if missing
            title: t.description,
            date: new Date(t.date).toLocaleDateString(),
            amount: Number(t.amount),
            type: t.type,
            color: t.category?.color || '#cbd5e1'
          })));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
              change={12.5}
              icon="💰"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatsCard
              title="Dépenses ce mois"
              value={expenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              change={-5.2}
              icon="💸"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatsCard
              title="Économies"
              value={(income - expenses).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              change={8.3}
              icon="🎯"
            />
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <GlassCard className="mb-8">
          <h2 className="text-xl font-bold mb-6">Actions rapides</h2>
          <div className="flex gap-6 justify-around">
            <FABButton icon="➕" label="Ajouter" onClick={() => setShowAddModal(true)} />
            <FABButton icon="📊" label="Statistiques" onClick={() => alert('Voir stats')} variant="success" />
            <FABButton icon="💳" label="Comptes" onClick={() => alert('Voir comptes')} />
            <FABButton icon="🎯" label="Objectifs" onClick={() => alert('Voir objectifs')} />
          </div>
        </GlassCard>

        {/* Recent Transactions */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Transactions récentes</h2>
            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Voir tout →
            </button>
          </div>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} {...transaction} />
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          // Recharger les données après ajout
          console.log('Transaction ajoutée avec succès !');
        }}
      />
    </div>
  );
}

export default Dashboard;
