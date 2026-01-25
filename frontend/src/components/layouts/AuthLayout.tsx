import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-600 to-secondary-600 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">Smart Budget</h1>
          <p className="mt-2 text-primary-100">
            Gestion financière personnelle avec sécurité bancaire
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
