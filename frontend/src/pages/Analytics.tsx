import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { ChartBarIcon, PieChartIcon, TrendingUpIcon, RadarIcon } from 'lucide-react';
import { dashboardService, DashboardStats } from '../services/dashboardService';
import { transactionService } from '../services/transactionService';
import { GlassCard } from '../components/ui/PremiumComponents';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Palette dynamique et moderne (Indigo, Emerald, Amber, Rose, Violet, Sky)
const PREMIUM_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#0ea5e9', '#ec4899', '#14b8a6'];

type ChartType = 'pie' | 'bar' | 'area' | 'radar';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 ring-1 ring-black/5">
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
        <p className="text-primary-600 dark:text-primary-400 font-bold text-lg">
          {Number(payload[0].value).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>
    );
  }
  return null;
};

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats['stats']>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<ChartType>('pie');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, transactionsResponse] = await Promise.all([
          dashboardService.getStats(),
          transactionService.getAll({ limit: 100 })
        ]);

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data.stats);
        }

        if (transactionsResponse.success && transactionsResponse.data) {
          const trans = transactionsResponse.data.transactions;
          // Group by date for line chart
          const grouped = trans.reduce((acc: any, t: any) => {
            // Use timestamp sortable
            const d = parseISO(t.date);
            const k = format(d, 'yyyy-MM-dd');
            if (t.type === 'EXPENSE') {
              acc[k] = (acc[k] || 0) + Number(t.amount);
            }
            return acc;
          }, {});

          const finalTs = Object.keys(grouped)
            .sort() // ISO sorting works fine
            .map(isoDate => ({
              fullDate: isoDate,
              date: format(parseISO(isoDate), 'dd MMM', { locale: fr }),
              amount: grouped[isoDate]
            }));

          setTimeSeriesData(finalTs);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <PieChart>
            <defs>
              {stats.map((_, index) => (
                <linearGradient key={`grad-${index}`} id={`colorPie-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PREMIUM_COLORS[index % PREMIUM_COLORS.length]} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={PREMIUM_COLORS[index % PREMIUM_COLORS.length]} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={stats}
              cx="50%"
              cy="50%"
              innerRadius={80} // Donut style looks more modern
              outerRadius={140}
              paddingAngle={5}
              dataKey="amount"
              stroke="none"
            >
              {stats.map((_, index) => (
                <Cell key={`cell-${index}`} fill={`url(#colorPie-${index})`} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={stats} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.2} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="category"
              type="category"
              width={100}
              tick={{ fill: '#6B7280', fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" name="Montant" radius={[0, 8, 8, 0]} barSize={32}>
              {stats.map((_, index) => (
                <Cell key={`cell-${index}`} fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={timeSeriesData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAmount)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
            />
          </AreaChart>
        );
      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={stats}>
            <PolarGrid strokeOpacity={0.1} />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
            <Radar
              name="Dépenses"
              dataKey="amount"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="#8b5cf6"
              fillOpacity={0.3}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Statistiques
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Analysez la dynamique de vos finances
          </p>
        </motion.div>

        <GlassCard className="mb-8 min-h-[600px] flex flex-col">
          <div className="flex flex-col xl:flex-row justify-between items-center mb-8 gap-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {chartType === 'pie' && 'Répartition des dépenses'}
              {chartType === 'bar' && 'Comparatif par catégorie'}
              {chartType === 'area' && 'Évolution temporelle'}
              {chartType === 'radar' && 'Équilibre des postes'}
            </h2>

            <div className="bg-gray-100/50 dark:bg-gray-800/50 p-2 rounded-2xl backdrop-blur-sm shadow-inner flex flex-wrap justify-center gap-2">
              {[
                { type: 'pie', icon: PieChartIcon, label: 'Donut' },
                { type: 'bar', icon: ChartBarIcon, label: 'Barres' },
                { type: 'area', icon: TrendingUpIcon, label: 'Évolution' },
                { type: 'radar', icon: RadarIcon, label: 'Radar' },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => setChartType(btn.type as ChartType)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 z-10 ${chartType === btn.type ? 'text-indigo-600 font-semibold' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {chartType === btn.type && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white dark:bg-gray-700 shadow-md rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <btn.icon className="w-5 h-5" />
                    <span className="text-sm">{btn.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={chartType}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex-1 w-full h-full min-h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              {renderChart() as any}
            </ResponsiveContainer>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
}

export default Analytics;
