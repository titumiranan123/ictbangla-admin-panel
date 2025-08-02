// hooks/useUpdateOrderCallStatus.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api_url } from "@/hooks/apiurl"; // তোমার axios instance

interface UpdateOrderPayload {
  orderId: any;
  updates: Record<string, any>;
}

export const useUpdateOrderCallStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, updates }: UpdateOrderPayload) => {
      console.log(orderId);
      if (updates && updates.result === "true") {
        await api_url.patch(
          `/v1/admin-user/add-agenda-on-purchase/${orderId._id}`,
          updates
        );
        await api_url.post(
          `/v1/admin-user/manual-admin-payment/${orderId?.paymentId?._id}`
        );
        return;
      }
      if (updates && updates.result === "false") {
        await api_url.patch(
          `/v1/admin-user/add-agenda-on-purchase/${orderId._id}`,
          updates
        );
        await api_url.post(
          `/v1/admin-user/manual-admin-payment/${orderId._id}`
        );
        return;
      }
      const response = await api_url.patch(
        `/v1/admin-user/add-agenda-on-purchase/${orderId._id}`,
        updates
      );
      return response.data;
    },

    onSuccess: (data, variables) => {
      const { orderId, updates } = variables;

      console.log("✅ Order updated successfully:", data, variables);

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

      // ✅ ব্যাকআপ হিসেবে invalidate
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },

    onError: (error) => {
      console.error("❌ Error updating order:", error);
      // তুমি চাইলে এখানে toast.notification বা error alert দেখাতে পারো
    },
  });
};
