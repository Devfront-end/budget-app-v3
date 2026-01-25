import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-xl text-gray-600">Page non trouvée</p>
        <Link to="/" className="mt-4 inline-block btn btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
