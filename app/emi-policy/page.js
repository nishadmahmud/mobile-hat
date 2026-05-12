import Link from 'next/link';
import { bankEmiData } from '../../lib/emiData';

const monthColumns = [
  { key: 'm3', label: '3M' },
  { key: 'm6', label: '6M' },
  { key: 'm9', label: '9M' },
  { key: 'm12', label: '12M' },
  { key: 'm18', label: '18M' },
  { key: 'm24', label: '24M' },
  { key: 'm36', label: '36M' },
];

export default function EmiPolicyPage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="mb-8">
          <div className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-semibold mb-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-blue-600">EMI Policy</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">EMI Policy & Bank Charge Table</h1>
          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-4xl leading-relaxed">
            This page shows the same EMI bank charge dataset used in the EMI calculator on product pages. Charges vary by bank, tenure, and card/payment channel.
            Final installment amount is calculated at checkout based on the selected product price and active bank charge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <p className="text-[11px] uppercase tracking-[0.1em] text-blue-700 font-semibold mb-1">Eligibility</p>
            <p className="text-sm text-gray-700 font-medium">EMI facility is available for eligible card holders and supported banks.</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
            <p className="text-[11px] uppercase tracking-[0.1em] text-amber-700 font-semibold mb-1">Charge Type</p>
            <p className="text-sm text-gray-700 font-medium">Values below are charge percentages by tenure, not flat fees.</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
            <p className="text-[11px] uppercase tracking-[0.1em] text-emerald-700 font-semibold mb-1">Need Help?</p>
            <p className="text-sm text-gray-700 font-medium">For latest bank updates, contact support before placing order.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-gray-500 font-semibold border-b border-gray-200">Bank</th>
                  {monthColumns.map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-center text-[11px] uppercase tracking-[0.1em] text-gray-500 font-semibold border-b border-gray-200"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {bankEmiData.map((bank) => (
                  <tr key={bank.bank} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">{bank.bank}</td>
                    {monthColumns.map((col) => (
                      <td key={`${bank.bank}-${col.key}`} className="px-4 py-3 text-center text-sm text-gray-700">
                        {bank[col.key] ? `${bank[col.key]}%` : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Disclaimer: Rates can be updated by banks without prior notice. Mobile Hat reserves the right to update this table to match latest partner bank instructions.
        </p>
      </div>
    </main>
  );
}

