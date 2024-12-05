export const OverviewItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
  }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
      <div className="mb-2">{icon}</div>
      <div className="text-xs text-gray-500 font-medium mb-1">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );