import CartService from "./cart.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

class CartController {

    // Add To Cart
    async addToCart(req, res, next) {
        try {
            const userId = req.user._id;
            const { productId, quantity } = req.body;

            const cart = await CartService.addToCart(
                userId,
                productId,
                quantity
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    cart,
                    "Product added to cart successfully"
                )
            );
        } catch (error) {
            next(error);
        }
    }

    // Get Cart
    async getCart(req, res, next) {
        try {
            const userId = req.user._id;

            const cart = await CartService.getCart(userId);

            return ApiResponse.success(
                res,
                cart,
                "Cart fetched successfully"
            );
        } catch (error) {
            next(error);
        }
    }

    // Update Quantity
    async updateQuantity(req, res, next) {
        try {
            const userId = req.user._id;
            const { productId } = req.params;
            const { quantity } = req.body;

            const cart = await CartService.updateQuantity(
                userId,
                productId,
                quantity
            );

            return ApiResponse.success(
                res,
                cart,
                "Quantity updated successfully"
            );
        } catch (error) {
            next(error);
        }
    }

    // Remove Item
    async removeItem(req, res, next) {
        try {
            const userId = req.user._id;
            const { productId } = req.params;

            const cart = await CartService.removeFromCart(
                userId,
                productId
            );

            return ApiResponse.success(
                res,
                cart,
                "Item removed successfully"
            );
        } catch (error) {
            next(error);
        }
    }

    // Clear Cart
    async clearCart(req, res, next) {
        try {
            const userId = req.user._id;

            const cart = await CartService.clearCart(userId);

            return ApiResponse.success(
                res,
                cart,
                "Cart cleared successfully"
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new CartController();