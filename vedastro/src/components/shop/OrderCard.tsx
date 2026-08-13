"use client";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../common/Button";

import type { Order } from "../../types/order";

interface Props {
  order: Order;
  onView?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export default function OrderCard({
  order,
  onView,
  onCancel,
}: Props) {
  const badge =
    order.orderStatus === "DELIVERED"
      ? "success"
      : order.orderStatus === "CANCELLED"
        ? "error"
        : "warning";

  const canCancel =
    order.orderStatus !== "DELIVERED" &&
    order.orderStatus !== "CANCELLED";

  return (
    <Card className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      {/* ORDER INFO */}
      <div>
        <h3 className="font-black">
          #{order._id}
        </h3>

        <p className="text-sm text-slate-400">
          {order.items?.length || 0} Items
        </p>

        <p className="text-sm text-slate-400">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="text-left sm:text-right">
        <Badge variant={badge}>
          {order.orderStatus}
        </Badge>

        <p className="mt-3 text-xl font-black">
          ₹{order.total}
        </p>

        {/* BUTTONS */}
        <div className="mt-3 flex gap-2 sm:justify-end">
          <Button
            size="sm"
            onClick={() => onView?.(order._id)}
          >
            View Order
          </Button>

          {canCancel && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => onCancel?.(order._id)}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}