import cartRepository from "./cart.repository.js";
import ProductRepository from "../product/product.repository.js";
import ApiError from "../../utils/ApiError.js";

class CartService {

    // Add a product to the user's cart
    async addToCart(userId, productId, quantity) {

        // Check if the product exists
        const product = await ProductRepository.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        // find the user's cart
        let cart = await cartRepository.findByUser(userId);

        // create cart if it doesn't exist
        if (!cart) {
            cart = await cartRepository.create(userId);
        }

        // Check if product already exists
        const item = cart.items.find(
            (i) => i.product._id.toString() === productId
        );

        if (item) {
            item.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
            });
        }

        await cartRepository.save(cart);

        return await cartRepository.findByUser(userId);
    }

    // Get cart
    async getCart(userId) {
        let cart = await cartRepository.findByUser(userId);
        if (!cart) {
            cart = await cartRepository.create(userId);
        }
        return cart;
    }

    // Update quantity of a product in the cart
    async updateQuantity(userId, productId, quantity) {
        const cart = await cartRepository.findByUser(userId);
        if (!cart) {
            throw new ApiError(404, "Cart not found");
        }
        
        const item = cart.items.find(
            (i) => i.product._id.toString() === productId
        );

        if (!item) {
            throw new ApiError(404, "Product not found in cart");
        }

        item.quantity = quantity;
        await cartRepository.save(cart);

        return await cartRepository.findByUser(userId);
    }

    // Remove a product from the cart
    async removeFromCart(userId, productId) {
        const cart = await cartRepository.findByUser(userId);
        if (!cart) {
            throw new ApiError(404, "Cart not found");
        }

        cart.items = cart.items.filter(
            (i) => i.product._id.toString() !== productId
        );

        await cartRepository.save(cart);

        return await cartRepository.findByUser(userId);
    }

    // Clear the cart
    async clearCart(userId) {
        const cart = await cartRepository.findByUser(userId);
        if (!cart) {
            throw new ApiError(404, "Cart not found");
        }

        cart.items = [];
        await cartRepository.save(cart);

        return cart;
    }
}


export default new CartService();