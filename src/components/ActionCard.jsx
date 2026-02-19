// src/components/ActionCard.jsx

export function ActionCard({ title, icon, children }) {
  return (
    <div className="flex flex-col justify-start items-start w-full gap-4 p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>

      <div className="flex flex-col gap-3 w-full">{children}</div>
    </div>
  );
}
