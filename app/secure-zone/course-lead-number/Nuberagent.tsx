"use client";

import { api_url } from "@/hooks/apiurl";
import { useAllAgent } from "@/hooks/useAllAgent";

interface OrderAgentCellProps {
  order: any;
  refetch: () => void;
}

export const NumberAgent = ({ order, refetch }: OrderAgentCellProps) => {
  const { data: agents = [], isLoading } = useAllAgent();

  const handleChange = async (agentId: string) => {
    try {
      const response = await api_url.patch(
        `/v1/admin-user/update-number-lead/${order._id}`,
        { call_agent: agentId }
      );
      if (response.status === 200 || response.status === 201) {
        refetch();
      }
    } catch (error) {
      console.error("Failed to update agent:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <select
      value={order?.call_agent?._id || ""}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full p-1 border rounded text-sm"
    >
      <option value="" disabled>
        Select Agent
      </option>
      {agents.map((agent: any) => (
        <option key={agent._id} value={agent._id}>
          {agent.name}
        </option>
      ))}
    </select>
  );
};
