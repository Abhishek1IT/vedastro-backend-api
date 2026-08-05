import Order from "../../models/Order.js";

class OrderRepository {
    async createOrder(orderData) {
        return await Order.create(orderData);
    }

    async findByUserId(userId) {
        return await Order.find({ user: userId })
            .populate("items.product")
            .sort({ createdAt: -1 });
    }

    async findById(orderId) {
        return await Order.findById(orderId)
            .populate("items.product");
    }

    async updateOrderStatus(orderId, status) {
        return await Order.findByIdAndUpdate(
            orderId,
            {
                orderStatus: status,
            },
            {
                new: true,
                runValidators: true,
            }
        ).populate("items.product");
    }

    async cancelOrder(orderId) {
        return await Order.findByIdAndUpdate(
            orderId,
            {
                orderStatus: "CANCELLED",
            },
            {
                new: true,
                runValidators: true,
            }
        ).populate("items.product");
    }
}

export default new OrderRepository();