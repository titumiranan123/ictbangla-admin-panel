"use client";

import { api_url } from "@/hooks/apiurl";
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
  refetch: () => void;
}

export const OrderAgentCell = ({ order, refetch }: OrderAgentCellProps) => {
  const { data: agents = [], isLoading } = useAllAgent();

  if (isLoading) return <div>Loading...</div>;
  const onUpdate = async (value: string) => {
    try {
      const response = await api_url.patch(
        `/v1/admin-user/add-agenda-on-purchase/${order._id}`,
        { call_agent: value }
      );
      if (response.status === 200 || response.status === 201) {
        refetch();
      }
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };
  return (
    <select
      value={order.agenda?.call_agent?._id || ""}
      onChange={(e) => onUpdate(e.target.value)}
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
