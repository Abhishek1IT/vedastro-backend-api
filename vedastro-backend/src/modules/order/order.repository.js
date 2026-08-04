import Order from "../../models/Order.js";

class OrderService {

    async createOrder(orderData) {
        return await Order.create(orderData);
    }

    async findByUUserId(userId) {
        return await Order.find({ user: userId }).populate("items.product").sort({ createdAt: -1 });
    }

    async findById(orderId) {
        return await Order.findById(orderId).populate("items.product");
    }

    async updateOrderStatus(orderId, status) {
        return await Order.findByIdAndUpdate(orderId, { status }, { new: true }).populate("items.product");
    }
}

export default new OrderService();