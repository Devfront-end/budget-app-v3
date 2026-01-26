// Premium UI Components
import { motion } from 'framer-motion';
import { ReactNode, Fragment } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

// Balance Card - Credit Card Style
export const BalanceCard = ({ balance, className = '' }: { balance: number; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`balance-card ${className}`}
    >
      <div className="relative z-10">
        <p className="text-sm font-medium text-white/70 uppercase tracking-wide">Solde Total</p>
        <h2 className="text-5xl font-bold mt-2">{balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</h2>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-white/60 text-sm">Tous les comptes</span>
          <span className="text-white/60 text-sm">💳</span>
        </div>
      </div>
    </motion.div>
  );
};

// Glass Card
export const GlassCard = ({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => {
  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
      className={`glass-card ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// FAB Button
export const FABButton = ({ icon, label, onClick, variant = 'primary' }: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'success' | 'danger';
}) => {
  const variants = {
    primary: 'from-primary-500 to-secondary-500',
    success: 'from-success-500 to-success-600',
    danger: 'from-danger-500 to-danger-600',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 group`}
    >
      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${variants[variant]} text-white shadow-float flex items-center justify-center text-2xl group-hover:shadow-2xl transition-shadow`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
    </motion.button>
  );
};

// Transaction Item
export const TransactionItem = ({ icon, title, date, amount, type, color, onEdit, onDelete }: {
  icon: string;
  title: string;
  date: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  color?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="transaction-item group relative pr-20"
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className="transaction-icon"
          style={{ backgroundColor: color || '#E5E7EB' }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white">{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
        </div>
      </div>
      <p className={type === 'INCOME' ? 'amount-income' : 'amount-expense'}>
        {type === 'INCOME' ? '+' : '-'}{amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
      </p>

      {/* Action Menu (Popup) */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
              <EllipsisVerticalIcon className="w-6 h-6" aria-hidden="true" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden">
              <div className="py-1">
                {onEdit && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit();
                        }}
                        className={`${active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                          } group flex w-full items-center px-4 py-2.5 text-sm font-medium transition-colors`}
                      >
                        Modifier
                      </button>
                    )}
                  </Menu.Item>
                )}
                {onDelete && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete();
                        }}
                        className={`${active ? 'bg-red-50 text-red-600' : 'text-red-500'
                          } group flex w-full items-center px-4 py-2.5 text-sm font-medium transition-colors`}
                      >
                        Supprimer
                      </button>
                    )}
                  </Menu.Item>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </motion.div>
  );
};

// Skeleton Loader
export const SkeletonCard = () => {
  return (
    <div className="card">
      <div className="skeleton-shimmer h-6 w-24 rounded mb-4" />
      <div className="skeleton-shimmer h-10 w-full rounded mb-2" />
      <div className="skeleton-shimmer h-4 w-3/4 rounded" />
    </div>
  );
};

// Category Icon Selector
export const CategoryIcon = ({ icon, label, color, selected, onClick }: {
  icon: string;
  label: string;
  color: string;
  selected?: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`category-icon ${selected ? 'selected' : ''}`}
      style={{ backgroundColor: `${color}20`, color }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs mt-1">{label}</span>
    </motion.button>
  );
};

// Stats Card
export const StatsCard = ({ title, value, change, icon }: {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
}) => {
  const isPositive = change && change > 0;

  return (
    <GlassCard className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {change !== undefined && (
          <p className={`text-sm mt-1 ${isPositive ? 'text-success-500' : 'text-danger-500'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        )}
      </div>
      <div className="text-4xl text-primary-500">{icon}</div>
    </GlassCard>
  );
};
