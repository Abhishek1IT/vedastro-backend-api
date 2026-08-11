"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductImage from "../../../components/shop/ProductImage";
import QuantitySelector from "../../../components/shop/QuantitySelector";
import Button from "../../../components/common/Button";
import Badge from "../../../components/ui/Badge";

import { useProductStore } from "../../../store/productStore";
import { useCartStore } from "../../../store/cartStore";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const { product, loading, fetchProduct } = useProductStore();

  const { addToCart } = useCartStore();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center text-white">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center text-white">
        Product Not Found
      </div>
    );
  }

  const imageUrls =
    product.images?.map((img) => {
      if (img.url.startsWith("http")) {
        return img.url;
      }

      return `${BACKEND_URL.replace(/\/$/, "")}/${img.url.replace(/^\//, "")}`;
    }) || [];

  const finalPrice = product.salePrice ?? product.price;

  // ADD TO CART
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      await addToCart(product._id, quantity, {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        salePrice: product.salePrice,
        stock: product.stock,
        energyTag: product.energyTag,
        images: product.images,
      });

      router.push("/cart");
    } catch (error) {
      console.error("Add To Cart Error:", error);

      alert("Unable to add product to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  // BUY NOW
  const handleBuyNow = async () => {
    try {
      setBuyingNow(true);

      await addToCart(product._id, quantity, {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        salePrice: product.salePrice,
        stock: product.stock,
        energyTag: product.energyTag,
        images: product.images,
      });

      router.push("/checkout");
    } catch (error) {
      console.error("Buy Now Error:", error);

      alert("Unable to proceed to checkout.");
    } finally {
      setBuyingNow(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-10">
      {/* BACK */}
      <div className="mx-auto mb-6 max-w-7xl">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* PRODUCT IMAGE */}
        <ProductImage images={imageUrls} title={product.name} />

        {/* PRODUCT DETAILS */}
        <div>
          <h1 className="text-4xl font-black text-white">{product.name}</h1>

          <p className="mt-2 text-slate-400">{product.category}</p>

          {/* PRICE */}
          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-black text-amber-400">
              ₹{finalPrice}
            </span>

            {product.salePrice && (
              <span className="text-xl text-slate-500 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* STOCK */}
          <div className="mt-4">
            {product.stock > 0 ? (
              <Badge variant="success">In Stock ({product.stock})</Badge>
            ) : (
              <Badge variant="error">Out Of Stock</Badge>
            )}
          </div>

          {/* QUANTITY */}
          <div className="mt-8">
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              max={product.stock}
            />
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex gap-4">
            {/* ADD TO CART */}
            <Button
              variant="secondary"
              className="flex-1"
              disabled={product.stock === 0 || addingToCart || buyingNow}
              onClick={handleAddToCart}
            >
              {addingToCart ? "Adding..." : "Add To Cart"}
            </Button>

            {/* BUY NOW */}
            <Button
              className="flex-1"
              disabled={product.stock === 0 || addingToCart || buyingNow}
              onClick={handleBuyNow}
            >
              {buyingNow ? "Processing..." : "Buy Now"}
            </Button>
          </div>

          {/* INFO */}
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h2 className="mb-4 text-xl font-black text-white">Description</h2>

            <p className="leading-7 text-slate-400">{product.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
