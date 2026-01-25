const transactions = [
  { name: "Richard Geez", amount: "+$80", time: "2m ago" },
  { name: "Tom Hanks", amount: "+$120", time: "10m ago" },
  { name: "Sofia Starn", amount: "+$56", time: "1h ago" },
];

export default function TransactionsPanel() {
  return (
    <div className="space-y-3">
      {transactions.map((t, i) => (
        <div
          key={i}
          className="flex justify-between items-center border border-base-300/60 rounded-lg p-3"
        >
          <div>
            <p className="text-sm font-medium">{t.name}</p>
            <p className="text-xs text-gray-500">{t.time}</p>
          </div>
          <span className="text-sm font-semibold text-emerald-600">
            {t.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
