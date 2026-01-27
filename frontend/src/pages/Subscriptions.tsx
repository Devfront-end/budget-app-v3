import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { GlassCard, StatsCard } from '../components/ui/PremiumComponents';
import { AddSubscriptionModal } from '../components/features/AddSubscriptionModal';
import { subscriptionService, Subscription } from '../services/subscriptionService';

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState({ totalMonthly: 0, activeCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsData, statsData] = await Promise.all([
        subscriptionService.getAll(),
        subscriptionService.getStats()
      ]);

      if (subsData.success) {
        setSubscriptions(subsData.data.subscriptions);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (sub: Subscription) => {
    setEditingSubscription(sub);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer cet abonnement ?')) {
      try {
        await subscriptionService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete subscription:', error);
      }
    }
  };

  // Helper to format days remaining
  const getDaysRemaining = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const renewal = new Date(dateStr);
    renewal.setHours(0, 0, 0, 0);

    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expiré';
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Demain';
    return `Dans ${diffDays} jours`;
  };

  return (
    <div className="p-6 pb-24 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Abonnements
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Gérez vos paiements récurrents</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => { setEditingSubscription(null); setShowAddModal(true); }}
              className="bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Nouveau
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatsCard
          title="Coût Mensuel Total"
          value={stats.totalMonthly.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          change={0}
          icon={<CalendarIcon className="w-8 h-8" />}
        />
        <StatsCard
          title="Abonnements Actifs"
          value={stats.activeCount}
          // Removing change prop here as it's not strictly percentage
          icon={<div className="text-2xl font-bold">#</div>}
          change={undefined}
        />
      </div>

      {/* Subscriptions List */}
      <div className="grid grid-cols-1 gap-4">
        {subscriptions.map((sub) => (
          <GlassCard key={sub.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl">
                {sub.icon || '📱'}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{sub.name}</h3>
                <p className="text-sm text-gray-500">{sub.category} • {sub.frequency === 'MONTHLY' ? 'Mensuel' : sub.frequency === 'YEARLY' ? 'Annuel' : 'Hebdo'}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900 dark:text-white">
                  {sub.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
                <p className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${getDaysRemaining(sub.nextRenewal) === "Expiré" ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                  {getDaysRemaining(sub.nextRenewal)}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(sub)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </GlassCard>
        ))}

        {subscriptions.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            Aucun abonnement pour le moment.
          </div>
        )}
      </div>

      <AddSubscriptionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        subscription={editingSubscription}
        onSuccess={fetchData}
      />
    </div>
  );
}

export default Subscriptions;
