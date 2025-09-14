"use client";

import { useAllAgent } from "@/hooks/useAllAgent";

interface Agent {
  _id: string;
  name: string;
}

interface Order {
  _id: string;
  agenda?: {
    call_agent?: {
      _id: string;
      name: string;
    };
  };
}

interface OrderAgentCellProps {
  order: Order;
  onUpdate: (orderId: any, field: keyof any, value: any) => void;
}

export const OrderAgentCell = ({ order, onUpdate }: OrderAgentCellProps) => {
  const { data: agents = [], isLoading } = useAllAgent();

  if (isLoading) return <div>Loading...</div>;

  return (
    <select
      value={order.agenda?.call_agent?._id || ""}
      onChange={(e) => onUpdate(order, "call_agent", e.target.value)}
      className="w-[140px] p-1 border rounded text-sm"
    >
      <option value="" disabled>
        Select Agent
      </option>
      {agents.map((agent: Agent) => (
        <option key={agent._id} value={agent._id}>
          {agent.name}
        </option>
      ))}
    </select>
  );
};
