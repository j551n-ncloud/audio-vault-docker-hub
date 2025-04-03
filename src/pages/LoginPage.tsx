
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const { user, isLoading } = useAuth();

  // Redirect to dashboard if already logged in
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-audio-dark"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">AudioVault</h1>
          <p className="text-gray-300">Your Docker-powered Audio Toolbox</p>
        </div>
        <LoginForm />
        <p className="mt-4 text-sm text-gray-400">
          Demo credentials: admin@example.com / password123
        </p>
      </div>
    </div>
  );
}
