"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, Lock, Star } from "lucide-react";

import ProductImage from "../../../components/shop/ProductImage";
import QuantitySelector from "../../../components/shop/QuantitySelector";
import Button from "../../../components/common/Button";
import Badge from "../../../components/ui/Badge";

import { useProductStore } from "../../../store/productStore";
import { useCartStore } from "../../../store/cartStore";

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

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
      <section className="container mx-auto px-4 py-24">
        {/* SKELETON LOADER */}
        <div className="mb-8 h-6 w-64 animate-pulse rounded bg-(--surface-secondary)"></div>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="aspect-square w-full animate-pulse rounded-2xl bg-(--surface-secondary)"></div>
          <div className="space-y-6">
            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-(--surface-secondary)"></div>
            <div className="h-6 w-1/4 animate-pulse rounded bg-(--surface-secondary)"></div>
            <div className="h-10 w-1/3 animate-pulse rounded-lg bg-(--surface-secondary)"></div>
            <div className="h-40 w-full animate-pulse rounded-2xl bg-(--surface-secondary)"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h2 className="mb-4 text-3xl font-black text-(--text-primary)">Product Not Found</h2>
        <p className="mb-8 text-(--text-secondary)">The celestial item you are looking for does not exist or has been removed.</p>
        <Link href="/shop">
          <Button variant="primary">Return to Shop</Button>
        </Link>
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
    <section className="container mx-auto px-4 py-24 transition-colors duration-200 bg-(--background)">

      {/* BREADCRUMB */}
      <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-(--text-muted)">
        <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/shop" className="hover:text-amber-500 transition-colors">Shop</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/shop?category=${product.category}`} className="hover:text-amber-500 transition-colors">{product.category}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-(--text-primary) truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">

        {/* PRODUCT IMAGE */}
        <div className="flex w-full justify-center">
          <div className="w-full max-w-xl">
            <ProductImage
              images={imageUrls}
              title={product.name}
            />
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-amber-500">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-(--text-primary) leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* PRICE */}
          <div className="mt-6 flex items-end gap-4">
            <span className="text-5xl font-black text-(--text-primary)">
              ₹{finalPrice}
            </span>

            {product.salePrice && (
              <span className="mb-1 text-2xl text-(--text-muted) line-through decoration-red-500/50 decoration-2">
                ₹{product.price}
              </span>
            )}

            {product.salePrice && (
              <Badge variant="success" className="mb-2 ml-2">
                Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
              </Badge>
            )}
          </div>

          {/* STOCK */}
          <div className="mt-6 border-b border-(--border) pb-8">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-(--text-secondary)">Availability:</span>
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-emerald-500">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-bold">In Stock ({product.stock})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-500">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                  <span className="font-bold">Out Of Stock</span>
                </div>
              )}
            </div>

            {/* QUANTITY */}
            <div className="mt-6 flex items-center gap-6">
              <span className="font-semibold text-(--text-secondary)">Quantity:</span>
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                max={product.stock}
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              variant="secondary"
              className="flex-1 py-4 text-lg font-bold shadow-lg shadow-black/5 hover:shadow-xl transition-all hover:-translate-y-1"
              disabled={
                product.stock === 0 ||
                addingToCart ||
                buyingNow
              }
              onClick={handleAddToCart}
            >
              {addingToCart ? "Adding to Cart..." : "Add To Cart"}
            </Button>

            <Button
              className="flex-1 py-4 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all hover:-translate-y-1"
              disabled={
                product.stock === 0 ||
                addingToCart ||
                buyingNow
              }
              onClick={handleBuyNow}
            >
              {buyingNow ? "Processing..." : "Buy It Now"}
            </Button>
          </div>

          {/* TRUST BADGES */}
          <div className="mt-8 grid grid-cols-3 gap-4 rounded-xl border border-(--border) bg-(--surface-secondary) p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="rounded-full bg-amber-500/10 p-3 text-amber-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-(--text-secondary)">100% Authentic</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
                <Lock className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-(--text-secondary)">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="rounded-full bg-blue-500/10 p-3 text-blue-500">
                <Truck className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-(--text-secondary)">Fast Delivery</span>
            </div>
          </div>

          {/* INFO TABS */}
          <div className="mt-10">
            <div className="flex gap-6 border-b border-(--border)">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === "description" ? "border-b-2 border-amber-500 text-amber-500" : "text-(--text-muted) hover:text-(--text-primary)"}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === "shipping" ? "border-b-2 border-amber-500 text-amber-500" : "text-(--text-muted) hover:text-(--text-primary)"}`}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-(--surface-tertiary) p-6">
              {activeTab === "description" && (
                <div className="prose prose-invert max-w-none text-(--text-secondary) leading-relaxed">
                  <p>{product.description}</p>
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="space-y-4 text-(--text-secondary) leading-relaxed">
                  <p className="flex items-start gap-3"><Truck className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" /> <strong>Free shipping</strong> on orders over ₹1000. Standard delivery takes 3-5 business days.</p>
                  <p className="flex items-start gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" /> <strong>7-Day Returns:</strong> If you are not completely satisfied, you can return this item within 7 days of delivery.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
