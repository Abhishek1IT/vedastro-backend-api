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
    <div className="flex w-fit items-center rounded-lg border border-(--border) bg-(--surface-tertiary) overflow-hidden">
      <button
        className="px-4 py-2 text-(--text-secondary) hover:bg-(--surface-secondary) hover:text-(--text-primary) transition-colors"
        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
      >
        −
      </button>

      <div className="min-w-[3rem] text-center font-bold text-(--text-primary)">{quantity}</div>

      <button
        className="px-4 py-2 text-(--text-secondary) hover:bg-(--surface-secondary) hover:text-(--text-primary) transition-colors"
        onClick={() => quantity < max && setQuantity(quantity + 1)}
      >
        +
      </button>
    </div>
  );
}
