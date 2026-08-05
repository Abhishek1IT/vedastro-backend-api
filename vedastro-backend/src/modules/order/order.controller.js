import OrderService from "./order.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

class OrderController {
    async createOrder(req, res, next) {
        try {
            const order = await OrderService.createOrder(
                req.user._id,
                req.body
            );

            return res
                .status(201)
                .json(new ApiResponse(201, order, "Order created successfully"));
        } catch (error) {
            next(error);
        }
    }

    async getOrdersByUserId(req, res, next) {
        try {
            const orders = await OrderService.getOrdersByUserId(
                req.user._id
            );

            return res
                .status(200)
                .json(new ApiResponse(200, orders, "Orders fetched successfully"));
        } catch (error) {
            next(error);
        }
    }

    async getOrderById(req, res, next) {
        try {
            const order = await OrderService.getOrderById(req.params.id);

            return res
                .status(200)
                .json(new ApiResponse(200, order, "Order fetched successfully"));
        } catch (error) {
            next(error);
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const order = await OrderService.updateOrderStatus(
                req.params.id,
                req.body.status
            );

            return res
                .status(200)
                .json(new ApiResponse(200, order, "Order status updated successfully"));
        } catch (error) {
            next(error);
        }
    }

    async cancelOrder(req, res, next) {
        try {
            const order = await OrderService.cancelOrder(
                req.params.id,
                req.user
            );

            return res.status(200).json(
                new ApiResponse(200, order, "Order cancelled successfully")
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController();