import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { categoryService } from '../services/categoryService';
import { AddCategoryModal } from '../components/features/AddCategoryModal';
import { GlassCard, FABButton, SkeletonCard } from '../components/ui/PremiumComponents';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      if (res.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error('Failed to load categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer cette catégorie ?')) {
      try {
        await categoryService.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 pb-24 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Catégories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gérez vos catégories de dépenses et revenus</p>
        </div>
        <FABButton icon={<PlusIcon className="w-6 h-6" />} label="Ajouter" onClick={() => setShowAddModal(true)} />
      </motion.div>



      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <GlassCard key={cat.id} className="relative group hover:scale-[1.02] transition-transform">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">{cat.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${cat.type === 'INCOME' ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'}`}>
                  {cat.type === 'INCOME' ? 'Revenu' : 'Dépense'}
                </span>

                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-danger-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </GlassCard>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              <p className="mb-4">Aucune catégorie trouvée ({categories.length}).</p>
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    await categoryService.initDefaults();
                    await fetchCategories();
                  } catch (e) { console.error(e); }
                }}
                className="text-primary-600 hover:text-primary-700 font-bold underline"
              >
                Restaurer les catégories par défaut
              </button>
            </div>
          )}
        </div>
      )}

      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchCategories}
      />
    </div>
  );
};

export default Categories;
