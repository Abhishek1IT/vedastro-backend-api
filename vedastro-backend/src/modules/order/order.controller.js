import OrderService from "./order.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

class OrderController {
    async createOrder(req, res, next) {
        try {
            const userId = req.user._id;
            const orderData = req.body;

            const order = await OrderService.createOrder(userId, orderData);

            return res.status(201).json(
                new ApiResponse(201, order, "Order created successfully.")
            );
        } catch (error) {
            next(error);
        }
    }

    async getOrdersByUserId(req, res, next) {
        try {
            const userId = req.user._id;
            const orders = await OrderService.getOrdersByUserId(userId);

            return res.status(200).json(
                new ApiResponse(200, orders, "Orders fetched successfully.")
            );
        } catch (error) {
            next(error);
        }
    }

    async getOrderById(req, res, next) {
        try {
            const orderId = req.params.id;
            const order = await OrderService.getOrderById(orderId);

            return res.status(200).json(
                new ApiResponse(200, order, "Order fetched successfully.")
            );
        } catch (error) {
            next(error);
        }   
    }

    async updateOrderStatus(req, res, next) {
        try {
            const orderId = req.params.id;
            const { status } = req.body;
            const order = await OrderService.updateOrderStatus(orderId, status);

            return res.status(200).json(
                new ApiResponse(200, order, "Order status updated successfully.")
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController();