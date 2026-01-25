import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Accueil' },
    { path: '/transactions', icon: '💸', label: 'Transactions' },
    { path: '/analytics', icon: '📊', label: 'Analytics' },
    { path: '/wishlist', icon: '🎯', label: 'Objectifs' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <motion.span
                className="text-2xl"
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {item.icon}
              </motion.span>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-600"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
