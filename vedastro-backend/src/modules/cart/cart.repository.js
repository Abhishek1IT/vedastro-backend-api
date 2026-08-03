import Cart from "../../models/Cart.js";

class CartRepository {
  async findByUser(userId) {
    return Cart.findOne({ user: userId }).populate("items.product");
  }

  async create(userId) {
    return Cart.create({
      user: userId,
      items: [],
    });
  }

  async save(cart) {
    return cart.save();
  }

  async delete(userId) {
    return Cart.findOneAndDelete({ user: userId });
  }
}

export default new CartRepository();