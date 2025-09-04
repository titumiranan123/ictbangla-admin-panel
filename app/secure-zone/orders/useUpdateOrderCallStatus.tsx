// hooks/useUpdateOrderCallStatus.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api_url } from "@/hooks/apiurl";

interface UpdateOrderPayload {
  orderId: any;
  updates: Record<string, any>;
  refetch: () => void;
}

export const useUpdateOrderCallStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, updates, refetch }: UpdateOrderPayload) => {
      // console.log("from updat function ", orderId);
      const response = await api_url.patch(
        `/v1/admin-user/add-agenda-on-purchase/${orderId._id}`,
        updates
      );
      if (response.status === 201) {
        if (
          updates?.result === "true" ||
          updates?.result === "false" ||
          updates?.result === "PENDING"
        ) {
          await api_url.post(
            `/v1/admin-user/manual-admin-payment/${
              orderId?.paymentId?._id
            }?paymentStatus=${updates.result === "true" ? "PAID" : "UNPAID"}`
          );
        }
      }
      return response.data;
    },

    onSuccess: (data, variables) => {
      const { orderId, updates, refetch } = variables;
      refetch();
      queryClient.setQueryData(["allOrders"], (oldData: any) => {
        if (!oldData) return oldData;

        const orders = Array.isArray(oldData) ? oldData : oldData.data;

        const updatedOrders = orders.map((order: any) =>
          order._id === orderId ? { ...order, ...updates } : order
        );

        return Array.isArray(oldData)
          ? updatedOrders
          : { ...oldData, data: updatedOrders };
      });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },

    onError: (error) => {
      console.error("❌ Error updating order:", error);
    },
  });
};
