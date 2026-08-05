"use client";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../common/Button";

import type { Order } from "../../types/order";

interface Props {
  order: Order;
  onView?: (id: string) => void;
}

export default function OrderCard({ order, onView }: Props) {
  const badge =
    order.orderStatus === "DELIVERED"
      ? "success"
      : order.orderStatus === "CANCELLED"
        ? "error"
        : "warning";

  return (
    <Card className="flex items-center justify-between">
      <div>
        <h3 className="font-black">#{order._id}</h3>

        <p className="text-sm text-slate-400">{order.items?.length} Items</p>

        <p className="text-sm text-slate-400">{order.createdAt}</p>
      </div>

      <div className="text-right">
        <Badge variant={badge}>{order.orderStatus}</Badge>

        <p className="mt-3 text-xl font-black">₹{order.total}</p>

        <Button size="sm" className="mt-3" onClick={() => onView?.(order._id)}>
          View Details
        </Button>
      </div>
    </Card>
  );
}
