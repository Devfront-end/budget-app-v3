import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { debtRatioService, DebtRatioData } from '../services/debtRatioService';

interface DebtFormData {
    monthlyIncome: number;
    monthlyDebts: number;
}

const COLORS = {
    GOOD: '#10B981',      // Green-500
    ACCEPTABLE: '#F59E0B', // Amber-500
    RISKY: '#EF4444',     // Red-500
};

const STATUS_MESSAGES = {
    GOOD: 'Excellent ! Votre endettement est maîtrisé.',
    ACCEPTABLE: 'Attention, vous approchez de la limite recommandée (33%).',
    RISKY: 'Situation critique. Votre taux d\'endettement dépasse 50%.',
};

export default function DebtRatio() {

    const [currentData, setCurrentData] = useState<DebtRatioData | null>(null);
    const [history, setHistory] = useState<DebtRatioData[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<DebtFormData>();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {

            const [latest, hist] = await Promise.all([
                debtRatioService.getLatest(),
                debtRatioService.getHistory()
            ]);
            setCurrentData(latest || null);
            setHistory(hist || []);
        } catch (error) {
            toast.error('Erreur lors du chargement des données');
        } finally {

        }
    };

    const onSubmit = async (data: DebtFormData) => {
        try {
            const result = await debtRatioService.update({
                monthlyIncome: Number(data.monthlyIncome),
                monthlyDebts: Number(data.monthlyDebts)
            });
            setCurrentData(result);
            fetchData(); // Refresh history
            toast.success('Calcul mis à jour !');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const getGaugeColor = (ratio: number) => {
        if (ratio < 33) return COLORS.GOOD;
        if (ratio <= 50) return COLORS.ACCEPTABLE;
        return COLORS.RISKY;
    };

    const getGaugeRotation = (ratio: number) => {
        // Map 0-100 to -90 to 90 degrees? Or 0 to 180 degrees.
        // CSS rotation: 0% = -90deg, 100% = 90deg.
        const clampedRatio = Math.min(Math.max(ratio, 0), 100);
        return (clampedRatio * 1.8) - 90; // 0 -> -90, 50 -> 0, 100 -> 90
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Taux d'endettement</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Update Form */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Mettre à jour ma situation</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Revenus mensuels (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('monthlyIncome', { required: 'Requis', min: 0 })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                defaultValue={currentData?.monthlyIncome}
                            />
                            {errors.monthlyIncome && <span className="text-red-500 text-xs">{errors.monthlyIncome.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dettes / Mensualités (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('monthlyDebts', { required: 'Requis', min: 0 })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                defaultValue={currentData?.monthlyDebts}
                            />
                            {errors.monthlyDebts && <span className="text-red-500 text-xs">{errors.monthlyDebts.message}</span>}
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Calculer
                        </button>
                    </form>
                </div>

                {/* Visualization Gauge */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800 absolute top-4 left-6">Votre Taux Actuel</h2>

                    {currentData ? (
                        <div className="mt-8 flex flex-col items-center">
                            {/* Semi-Circle Gauge */}
                            <div className="relative w-64 h-32 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-t-full"></div>
                                <div
                                    className="absolute top-0 left-0 w-full h-full rounded-t-full transition-transform duration-1000 ease-out origin-bottom"
                                    style={{
                                        backgroundColor: getGaugeColor(currentData.ratio),
                                        transform: `rotate(${getGaugeRotation(currentData.ratio)}deg)`
                                    }}
                                ></div>
                            </div>
                            <div className="text-4xl font-bold mt-[-10px] z-10 text-gray-800">
                                {currentData.ratio}%
                            </div>

                            <div className={`mt-4 px-4 py-2 rounded-full text-sm font-medium border
                ${currentData.status === 'GOOD' ? 'bg-green-100 text-green-800 border-green-200' :
                                    currentData.status === 'ACCEPTABLE' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                        'bg-red-100 text-red-800 border-red-200'}`}
                            >
                                {STATUS_MESSAGES[currentData.status]}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center mt-10">
                            Aucune donnée. Remplissez le formulaire à gauche.
                        </div>
                    )}
                </div>
            </div>

            {/* History Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Évolution sur 6 mois</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history.slice().reverse()}>
                            <defs>
                                <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis unit="%" />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="ratio"
                                stroke="#6366f1"
                                fillOpacity={1}
                                fill="url(#colorRatio)"
                                name="Taux d'endettement"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
