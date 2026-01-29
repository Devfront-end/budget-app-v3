import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { setCredentials } from '@/store/slices/authSlice';
import { authService, LoginCredentials } from '@/services/authService';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success) {
        dispatch(setCredentials(response.data));
        toast.success('Connexion réussie !');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-white">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Connexion</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email', { required: 'Email requis' })}
            id="email"
            type="email"
            className="input mt-1"
            placeholder="vous@exemple.com"
          />
          {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            {...register('password', { required: 'Mot de passe requis' })}
            id="password"
            type="password"
            className="input mt-1"
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Pas encore de compte ?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
          S'inscrire
        </Link>
      </p>
    </div>
  );
}

export default Login;
