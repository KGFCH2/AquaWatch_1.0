import { LoadingSpinner } from "./LoadingSpinner";

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};
