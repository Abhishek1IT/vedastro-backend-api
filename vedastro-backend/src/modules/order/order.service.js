import orderRepository from "./order.repository";
import Cart from "../../models/Cart.js";
import ApiError from "../../utils/ApiError.js";

class OrderService {
    async createOrder(userId, orderData) {
        // Check if the user has a cart
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            throw new ApiError(400, "Cart is empty");
        }

        // Create the order
        const order = await orderRepository.createOrder({
            ...orderData,
            user: userId,
            items: cart.items,
        });

        // Clear the user's cart
        await Cart.deleteOne({ user: userId });

        return order;
    }

    async getOrdersByUserId(userId) {
        return await orderRepository.findByUUserId(userId);
    }

    async getOrderById(orderId) {
        const order = await orderRepository.findById(orderId);
        if (!order) {
            throw new ApiError(404, "Order not found");
        }
        return order;
    }

    async updateOrderStatus(orderId, status) {
        const order = await orderRepository.updateOrderStatus(orderId, status);

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        return order;
    }
}

export default new OrderService();