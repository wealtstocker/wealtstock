// src/pages/dashboard/trades/TradeDetails.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Descriptions, Tag, Spin, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleTrade } from "../../../redux/Slices/tradeSlice";

const TradeDetails = () => {
  console.log("ok");
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { single: trade, loading } = useSelector((state) => state.trade);

  useEffect(() => {
    dispatch(fetchSingleTrade(id));
  }, [dispatch, id]);

  if (loading) return <Spin />;
  if (!trade) return <p>No trade found</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Trade Details</h2>
      <Button
        type="primary"
        className="mb-4"
        onClick={() => navigate(`/dashboard/trades/edit/${trade.id}`)}
      >
        Update Trade
      </Button>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Trade Number">
          {trade.trade_number}
        </Descriptions.Item>
        <Descriptions.Item label="Customer ID">
          {trade.customer_id}
        </Descriptions.Item>
        <Descriptions.Item label="Instrument">
          {trade.instrument}
        </Descriptions.Item>
        <Descriptions.Item label="Buy Price">
          {trade.buy_price}
        </Descriptions.Item>
        <Descriptions.Item label="Buy Quantity">
          {trade.buy_quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Buy Value">
          {trade.buy_value}
        </Descriptions.Item>
        <Descriptions.Item label="Exit Price">
          {trade.exit_price}
        </Descriptions.Item>
        <Descriptions.Item label="Exit Quantity">
          {trade.exit_quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Exit Value">
          {trade.exit_value}
        </Descriptions.Item>
        <Descriptions.Item label="Brokerage">
          {trade.brokerage}
        </Descriptions.Item>
        <Descriptions.Item label="Profit / Loss">
          <Tag color={trade.profit_loss === "profit" ? "green" : "red"}>
            {trade.profit_loss}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="P/L Value">
          ₹ {trade.profit_loss_value}
        </Descriptions.Item>
        <Descriptions.Item label="Status">{trade.status}</Descriptions.Item>
        <Descriptions.Item label="Created By">
          {trade.created_by}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default TradeDetails;
