import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleTrade } from '../../../redux/Slices/tradeSlice';
import dayjs from 'dayjs';

const TradeDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { single, loading } = useSelector((state) => state.trade);
const navigate = useNavigate()
  console.log(id)
  useEffect(() => {
    
    if(id){
      console.log(id)
      dispatch(fetchSingleTrade({id, navigate}));
    }
  }, [dispatch, id,navigate]);

  if (loading || !single) return <div className="p-6">Loading trade...</div>;

  const formatDate = (date) => dayjs(date).format('DD MMM YYYY, hh:mm A');
  const isProfit = single.profit_loss === 'profit';

  return (
    <div className="p-6 max-w-3xl mx-auto pt-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">📄 Trade Detail: {single.trade_number}</h2>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <InfoItem label="Customer ID" value={single.customer_id} />
        <InfoItem label="Stock Name" value={single.stock_name} />
        <InfoItem label="Status" value={single.status} />
        <InfoItem label="Created By" value={single.created_by} />
        <InfoItem label="Trade Date" value={formatDate(single.created_at)} />
        <InfoItem label="Last Updated" value={formatDate(single.updated_at)} />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <InfoCard title="Buy Details" items={[
          { label: "Buy Price", value: `₹${single.buy_price}` },
          { label: "Buy Qty", value: single.buy_quantity },
          { label: "Buy Value", value: `₹${single.buy_value}` },
        ]} />

        <InfoCard title="Sell Details" items={[
          { label: "Exit Price", value: `₹${single.exit_price}` },
          { label: "Exit Qty", value: single.exit_quantity },
          { label: "Exit Value", value: `₹${single.exit_value}` },
        ]} />
      </div>

      <div className="mt-6">
        <div className={`text-lg font-bold px-4 py-3 rounded-lg ${isProfit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          Profit/Loss: ₹{parseFloat(single.profit_loss_value).toFixed(2)} ({single.profit_loss})
        </div>
      </div>

      <div className="mt-6">
        <InfoItem label="Brokerage" value={`₹${single.brokerage}`} />
      </div>
    </div>
  );
};

// Simple field line
const InfoItem = ({ label, value }) => (
  <div className="bg-white rounded border p-3 shadow-sm">
    <span className="text-gray-500 font-medium">{label}: </span>
    <span className="font-semibold">{value}</span>
  </div>
);

// Card for grouped data
const InfoCard = ({ title, items }) => (
  <div className="bg-white rounded-lg shadow-md p-4 border">
    <h4 className="text-md font-semibold mb-2 text-blue-600">{title}</h4>
    <ul className="space-y-1">
      {items.map((item, idx) => (
        <li key={idx} className="text-sm">
          <span className="text-gray-600">{item.label}: </span>
          <strong>{item.value}</strong>
        </li>
      ))}
    </ul>
  </div>
);

export default TradeDetailPage;
