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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

type ChartType = 'pie' | 'bar' | 'area' | 'radar';

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
          transactionService.getAll({ limit: 100 }) // Get last 100 for evolution
        ]);

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data.stats);
        }

        if (transactionsResponse.success && transactionsResponse.data) {
          // Process for Time Series (Area Chart)
          // Group by date (DD/MM) and sum amounts (expenses only usually? or net?) 
          // Let's show Expenses Evolution for now as it matches "Categories" context
          const trans = transactionsResponse.data.transactions;
          const grouped = trans.reduce((acc: any, t: any) => {
            const dateKey = format(parseISO(t.date), 'dd/MM', { locale: fr });
            if (t.type === 'EXPENSE') {
              acc[dateKey] = (acc[dateKey] || 0) + Number(t.amount);
            }
            return acc;
          }, {});

          const tsData = Object.keys(grouped).map(date => ({
            date,
            amount: grouped[date]
          })).reverse(); // Assuming API returns desc, we want asc usually? No, API returns desc. reverse() makes it asc (oldest first)? 
          // Actually API returns desc date. Grouping preserves order if careful. 
          // Let's just map and reverse.

          // Better: standard sort
          const sortedTsData = Object.keys(grouped).sort((a, b) => {
            // Quick hack for DD/MM sort within same year... might fail across years.
            // Ideally rely on ISO sort.
            // Let's define grouped key as ISO first.
            return 0;
          }).map(date => ({ date, amount: grouped[date] }));

          // Re-doing robustly:
          const tempMap = new Map();
          trans.forEach((t: any) => {
            if (t.type !== 'EXPENSE') return;
            const d = parseISO(t.date);
            const k = format(d, 'yyyy-MM-dd');
            const val = Number(t.amount);
            tempMap.set(k, (tempMap.get(k) || 0) + val);
          });
          const finalTs = Array.from(tempMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0])) // Ascending date
            .map(([isoDate, amount]) => ({
              date: format(parseISO(isoDate), 'dd MMM', { locale: fr }),
              amount
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
            <Pie
              data={stats}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={130}
              fill="#8884d8"
              dataKey="amount"
            >
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} />
            <Legend />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={stats} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" width={100} />
            <Tooltip formatter={(value: number) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} />
            <Legend />
            <Bar dataKey="amount" name="Dépenses" fill="#8884d8" radius={[0, 4, 4, 0]}>
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip formatter={(value: number) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} />
            <Area type="monotone" dataKey="amount" name="Dépenses" stroke="#8884d8" fillOpacity={1} fill="url(#colorAmount)" />
          </AreaChart>
        );
      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
            <Radar name="Dépenses" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Legend />
            <Tooltip formatter={(value: number) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} />
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Statistiques
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Analysez vos finances sous tous les angles</p>
        </motion.div>

        <GlassCard className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-xl font-bold">Visualisation</h2>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto max-w-full">
              {[
                { type: 'pie', icon: PieChartIcon, label: 'Répartition' },
                { type: 'bar', icon: ChartBarIcon, label: 'Comparatif' },
                { type: 'area', icon: TrendingUpIcon, label: 'Évolution' },
                { type: 'radar', icon: RadarIcon, label: 'Radar' },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => setChartType(btn.type as ChartType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${chartType === btn.type
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                  <btn.icon className="w-4 h-4" />
                  <span className="text-sm">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart() as any}
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default Analytics;
