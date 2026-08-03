"use client";

import Image from "next/image";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../common/Button";
import QuantitySelector from "./QuantitySelector";

export interface CartProduct {
  _id: string;
  quantity: number;

  product: {
    _id: string;
    slug: string;
    title: string;
    category: string;
    image: string;
    price: number;
    salePrice?: number;
    stock: number;
    energyTag?: string;
  };
}

interface CartItemProps {
  item: CartProduct;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const product = item.product;

  const price = product.salePrice ?? product.price;

  return (
    <Card className="flex flex-col gap-5 md:flex-row">
      <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-slate-800">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        {product.energyTag && (
          <Badge variant="amber" className="mb-2">
            ✨ {product.energyTag}
          </Badge>
        )}

        <h3 className="text-xl font-bold">{product.title}</h3>

        <p className="mt-1 text-slate-400">{product.category}</p>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-2xl font-black text-amber-400">₹{price}</span>

          {product.salePrice && (
            <span className="line-through text-slate-500">
              ₹{product.price}
            </span>
          )}
        </div>

        <div className="mt-5">
          <QuantitySelector
            quantity={item.quantity}
            setQuantity={(qty) => {
              if (qty > item.quantity) {
                onIncrease();
              } else {
                onDecrease();
              }
            }}
            max={product.stock}
          />
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div className="text-right">
          <p className="text-sm text-slate-400">Total</p>

          <p className="text-2xl font-black text-white">
            ₹{price * item.quantity}
          </p>
        </div>

        <Button variant="danger" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </Card>
  );
}
