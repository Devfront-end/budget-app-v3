import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { budgetService, Budget, BudgetProgress, CreateBudgetData } from '@/services/budgetService';
import { categoryService } from '@/services/categoryService';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [budgetProgress, setBudgetProgress] = useState<BudgetProgress[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBudgetData>({
    defaultValues: {
      month: new Date().toISOString().slice(0, 7), // YYYY-MM format
      totalIncome: 0,
      totalExpense: 0,
      categories: {},
    },
  });

  useEffect(() => {
    loadBudgets();
    loadCategories();
  }, []);

  const loadBudgets = async () => {
    try {
      const response = await budgetService.getBudgets();
      if (response.success) {
        setBudgets(response.data.budgets);
      }
    } catch (error: any) {
      toast.error('Erreur lors du chargement des budgets');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (error: any) {
      toast.error('Erreur lors du chargement des catégories');
    }
  };

  const onSubmit = async (data: CreateBudgetData) => {
    setIsLoading(true);
    try {
      // categories is already an object { [key: string]: number }
      // No need to convert from array

      const response = await budgetService.createBudget(data);
      if (response.success) {
        toast.success('Budget créé avec succès !');
        setShowCreateForm(false);
        reset();
        loadBudgets();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erreur lors de la création du budget');
    } finally {
      setIsLoading(false);
    }
  };

  const viewBudgetProgress = async (budget: Budget) => {
    setSelectedBudget(budget);
    try {
      const response = await budgetService.getBudgetProgress(budget.month);
      if (response.success) {
        setBudgetProgress(response.data.progress);
      }
    } catch (error: any) {
      toast.error('Erreur lors du chargement du progrès du budget');
    }
  };

  const deleteBudget = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) return;

    try {
      await budgetService.deleteBudget(id);
      toast.success('Budget supprimé avec succès');
      loadBudgets();
      if (selectedBudget?.id === id) {
        setSelectedBudget(null);
        setBudgetProgress(null);
      }
    } catch (error: any) {
      toast.error('Erreur lors de la suppression du budget');
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Catégorie inconnue';
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'over': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budgets</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          {showCreateForm ? 'Annuler' : 'Nouveau Budget'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Créer un Budget</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mois
                </label>
                <input
                  {...register('month', { required: 'Mois requis' })}
                  type="month"
                  className="input"
                />
                {errors.month && <p className="mt-1 text-sm text-red-600">{errors.month.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Revenus Totaux (€)
                </label>
                <input
                  {...register('totalIncome', {
                    required: 'Revenus requis',
                    min: { value: 0, message: 'Doit être positif' }
                  })}
                  type="number"
                  step="0.01"
                  className="input"
                />
                {errors.totalIncome && <p className="mt-1 text-sm text-red-600">{errors.totalIncome.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dépenses Totales (€)
                </label>
                <input
                  {...register('totalExpense', {
                    required: 'Dépenses requis',
                    min: { value: 0, message: 'Doit être positif' }
                  })}
                  type="number"
                  step="0.01"
                  className="input"
                />
                {errors.totalExpense && <p className="mt-1 text-sm text-red-600">{errors.totalExpense.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budgets par Catégorie (optionnel)
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Vous pourrez ajouter des catégories après la création du budget
              </p>
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={isLoading} className="btn btn-primary">
                {isLoading ? 'Création...' : 'Créer Budget'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des budgets */}
        <div className="card bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Mes Budgets</h2>
          {budgets.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun budget créé</p>
          ) : (
            <div className="space-y-2">
              {budgets.map(budget => (
                <div
                  key={budget.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedBudget?.id === budget.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => viewBudgetProgress(budget)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{budget.month}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Revenus: {budget.totalIncome}€ | Dépenses: {budget.totalExpense}€
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBudget(budget.id);
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progrès du budget sélectionné */}
        {selectedBudget && budgetProgress && (
          <div className="card bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">
              Progrès - {selectedBudget.month}
            </h2>

            <div className="space-y-4">
              {budgetProgress.map(progress => (
                <div key={progress.categoryId} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{getCategoryName(progress.categoryId)}</span>
                    <span>{progress.actual}€ / {progress.budgeted}€ ({progress.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(progress.status)}`}
                      style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Restant: {progress.remaining}€
                    {progress.status === 'over' && ' ⚠️ Dépassement'}
                    {progress.status === 'warning' && ' ⚠️ Attention'}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Budget Total</p>
                  <p className="text-lg font-semibold">{selectedBudget.totalExpense}€</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Dépensé</p>
                  <p className="text-lg font-semibold">
                    {budgetProgress.reduce((sum, p) => sum + p.actual, 0)}€
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Budgets;