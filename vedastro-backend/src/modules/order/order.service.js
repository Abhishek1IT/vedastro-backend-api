import orderRepository from "./order.repository.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import ApiError from "../../utils/ApiError.js";

class OrderService {
    async createOrder(userId, orderData = {}) {
        let items = [];

        if (orderData.productId) {
            const product = await Product.findById(orderData.productId);

            if (!product) {
                throw new ApiError(404, "Product not found");
            }

            const quantity = Number(orderData.quantity) || 1;

            if (quantity <= 0) {
                throw new ApiError(400, "Invalid quantity");
            }

            if (product.stock < quantity) {
                throw new ApiError(
                    400,
                    `Only ${product.stock} items available`
                );
            }

            items = [
                {
                    product: product._id,
                    name: product.name,
                    image: product.images?.[0]?.url || "",
                    price: product.salePrice ?? product.price,
                    quantity,
                },
            ];
        }

        else {
            const cart = await Cart.findOne({ user: userId })
                .populate("items.product");

            if (!cart || cart.items.length === 0) {
                throw new ApiError(400, "Cart is empty");
            }

            const validItems = cart.items.filter(
                (item) => item.product
            );

            if (validItems.length === 0) {
                throw new ApiError(400, "Cart contains no valid products");
            }

            items = validItems.map((item) => ({
                product: item.product._id,
                name: item.product.name,
                image: item.product.images?.[0]?.url || "",
                price: item.product.salePrice ?? item.product.price,
                quantity: item.quantity,
            }));
        }

        const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const shipping = 0;
        const total = subtotal + shipping;

        const order = await orderRepository.createOrder({
            user: userId,
            items,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod || "COD",
            subtotal,
            shipping,
            total,
        });

        if (!orderData.productId) {
            await Cart.deleteOne({ user: userId });
        }

        return order;
    }

    async getOrdersByUserId(userId) {
        return await orderRepository.findByUserId(userId);
    }

    async getOrderById(orderId) {
        const order = await orderRepository.findById(orderId);

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        return order;
    }

    async updateOrderStatus(orderId, status) {
        const order = await orderRepository.updateOrderStatus(
            orderId,
            status
        );

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        return order;
    }

    async cancelOrder(orderId, user) {
        const order = await orderRepository.findById(orderId);

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        if (
            order.user.toString() !== user._id.toString() &&
            user.role !== "ADMIN"
        ) {
            throw new ApiError(403, "Access denied");
        }

        if (order.orderStatus === "DELIVERED") {
            throw new ApiError(
                400,
                "Delivered order cannot be cancelled"
            );
        }

        return await orderRepository.cancelOrder(orderId);
    }
}

export default new OrderService();