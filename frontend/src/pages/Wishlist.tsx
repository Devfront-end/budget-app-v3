import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, SparklesIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '../components/ui/PremiumComponents';
import { AddWishlistItemModal } from '../components/features/AddWishlistItemModal';
import { wishlistService, WishlistItem } from '../services/wishlistService';

function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getAll();
      if (data.success) {
        setItems(data.data.items);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item: WishlistItem) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer cet objectif ?')) {
      try {
        await wishlistService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent flex items-center gap-2">
              <SparklesIcon className="w-8 h-8 text-yellow-500" />
              Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Réalisez vos rêves, un euro à la fois</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => { setEditingItem(null); setShowAddModal(true); }}
              className="bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Nouvel Objectif
            </button>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const progress = calculateProgress(item.currentSavings, item.targetAmount);
          const isCompleted = progress >= 100;

          return (
            <GlassCard key={item.id} className="relative overflow-hidden group">
              {/* Image Background Overlay if available */}
              {item.imageUrl && (
                <div
                  className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
              )}

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                    {item.category}
                  </div>
                  {isCompleted && (
                    <div className="bg-success-100 text-success-700 px-3 py-1 rounded-full text-xs font-bold">
                      🎉 Complété !
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>

                <div className="mt-auto">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progression</span>
                    <span className="font-bold text-primary-600">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-success-500' : 'bg-gradient-to-r from-primary-500 to-secondary-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.currentSavings.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </p>
                      <p className="text-xs text-gray-500">
                        sur {item.targetAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <PencilSquareIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors group/del"
                      >
                        <TrashIcon className="w-5 h-5 text-gray-400 group-hover/del:text-danger-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {items.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-medium">Votre liste de souhaits est vide</p>
          <p className="mt-2">Commencez à épargner pour vos rêves dès aujourd'hui !</p>
        </div>
      )}

      <AddWishlistItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        item={editingItem}
        onSuccess={fetchData}
      />
    </div>
  );
}

export default Wishlist;
