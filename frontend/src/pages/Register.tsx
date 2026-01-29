import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService, RegisterData } from '@/services/authService';

function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response.success) {
        toast.success('Inscription réussie ! Connectez-vous maintenant.');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-white">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Inscription</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input {...register('firstName')} type="text" className="input mt-1" placeholder="Jean" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input {...register('lastName')} type="text" className="input mt-1" placeholder="Dupont" />
          </div>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nom d'utilisateur
          </label>
          <input
            {...register('username', { required: 'Nom d\'utilisateur requis' })}
            type="text"
            className="input mt-1"
            placeholder="jeandupont"
          />
          {errors.username && <p className="mt-1 text-sm text-error">{errors.username.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email', { required: 'Email requis' })}
            type="email"
            className="input mt-1"
            placeholder="vous@exemple.com"
          />
          {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            {...register('password', {
              required: 'Mot de passe requis',
              minLength: { value: 8, message: 'Minimum 8 caractères' },
            })}
            type="password"
            className="input mt-1"
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <input
            {...register('confirmPassword', {
              required: 'Confirmation requise',
              validate: (value) => value === password || 'Les mots de passe ne correspondent pas',
            })}
            type="password"
            className="input mt-1"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? 'Inscription...' : 'S\'inscrire'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Déjà un compte ?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Se connecter
        </Link>
      </p>
      <div className="mt-2 text-center">
        <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
          Mot de passe oublié ?
        </Link>
      </div>
    </div>
  );
}

export default Register;
