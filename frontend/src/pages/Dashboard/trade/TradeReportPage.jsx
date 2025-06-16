import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const dummyTrades = [
  {
    id: '456780897',
    date: '02-Jun-25',
    ref: '898787327',
    buyPrice: 100,
    buyQty: 5,
    sellPrice: 110,
    sellQty: 10,
    buyValue: 10,
    sellValue: 19,
    pnl: 200,
  },
  {
    id: '2345678',
    date: '03-Jun-25 23:45',
    ref: 'N/A',
    buyPrice: 4,
    buyQty: 44,
    sellPrice: 7,
    sellQty: 8,
    buyValue: 7,
    sellValue: 8,
    pnl: -800,
  },
];

const TradeReportPage = () => {
  const summary = {
    subtotal: 1000,
    brokerage: 10,
    gst: 1.8,
    stt: 2.5,
    tax: 1.25,
    net: 969.9,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="space-y-4">
        {dummyTrades.map((trade) => (
          <div key={trade.id} className="bg-white shadow-md p-4 rounded-xl border">
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold text-blue-700">{trade.id}</h2>
                <p className="text-sm text-gray-600">{trade.date}</p>
                <p className="text-xs text-gray-400">{trade.ref}</p>
                <p className="text-sm mt-2">Buy Price ₹{trade.buyPrice} | Qty {trade.buyQty}</p>
                <p className="text-sm">Buy Value: ₹{trade.buyValue}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.pnl >= 0 ? `+₹${trade.pnl.toFixed(2)}` : `₹${Math.abs(trade.pnl).toFixed(2)}`}
                </p>
                <p className="text-sm">Sell Price ₹{trade.sellPrice} | Qty {trade.sellQty}</p>
                <p className="text-sm">Sell Value: ₹{trade.sellValue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <table className="w-full border text-sm text-center bg-white shadow-sm">
          <tbody>
            <tr className="border-t">
              <td className="p-2 font-semibold">SUB TOTAL</td>
              <td className="p-2">₹{summary.subtotal.toFixed(2)}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2">BROK.</td>
              <td className="p-2">₹{summary.brokerage.toFixed(2)}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2">GST</td>
              <td className="p-2">₹{summary.gst.toFixed(2)}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2">STT</td>
              <td className="p-2">₹{summary.stt.toFixed(2)}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2">TAX/TXNT</td>
              <td className="p-2">₹{summary.tax.toFixed(2)}</td>
            </tr>
            <tr className="border-t font-bold bg-gray-100">
              <td className="p-2">NET VALUE</td>
              <td className="p-2">₹{summary.net.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeReportPage;
