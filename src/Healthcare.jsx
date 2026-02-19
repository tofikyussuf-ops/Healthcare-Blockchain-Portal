// src/Healthcare.jsx
import { ActionCard } from "./components/ActionCard"; // A reusable UI wrapper
import { useHealthcare } from "./hooks/useHealthcare";

function Healthcare() {
  const { account, isOwner, contract, loading } = useHealthcare();

  if (loading)
    return <div className="p-10 text-center">Connecting to Blockchain...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-green-700">
          HealthChain Portal
        </h1>
        <div className="text-right text-sm">
          <p className="text-gray-500 font-mono">
            {account || "Not Connected"}
          </p>
          {isOwner && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Admin
            </span>
          )}
        </div>
      </header>

      <main className="grid gap-6 md:grid-cols-2">
        <ActionCard title="Add Record" icon="➕">
          {/* Your Form Logic Here */}
        </ActionCard>

        <ActionCard title="Fetch Records" icon="🔍">
          {/* Your Search Logic Here */}
        </ActionCard>
      </main>
    </div>
  );
}

export default Healthcare;
