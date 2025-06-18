import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const TradeCard = ({ trade }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-xl border">
      <div className="flex justify-between items-start">
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
  );
};

export default TradeCard;
