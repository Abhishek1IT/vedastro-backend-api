"use client";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (qty: number) => void;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  setQuantity,
  max = 10,
}: QuantitySelectorProps) {
  return (
    <div className="flex w-fit items-center rounded-lg border border-slate-800">
      <button
        className="px-4 py-2 hover:bg-slate-800"
        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
      >
        −
      </button>

      <div className="min-w-12 text-center font-bold">{quantity}</div>

      <button
        className="px-4 py-2 hover:bg-slate-800"
        onClick={() => quantity < max && setQuantity(quantity + 1)}
      >
        +
      </button>
    </div>
  );
}
