import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CreditCardIcon,
  TagIcon,
  BanknotesIcon,
  ArrowPathIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', to: '/', icon: HomeIcon },
  { name: 'Transactions', to: '/transactions', icon: CreditCardIcon },
  { name: 'Budgets', to: '/budgets', icon: CalculatorIcon },
  { name: 'Catégories', to: '/categories', icon: TagIcon },
  { name: 'Comptes bancaires', to: '/bank-accounts', icon: BanknotesIcon },
  { name: 'Abonnements', to: '/subscriptions', icon: ArrowPathIcon },
  { name: 'Wishlist', to: '/wishlist', icon: HeartIcon },
  { name: 'Paiements 4X', to: '/payment-plans', icon: ClipboardDocumentListIcon },
  { name: 'Analytics', to: '/analytics', icon: ChartBarIcon },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h2 className="text-xl font-bold text-primary-600">Smart Budget</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
