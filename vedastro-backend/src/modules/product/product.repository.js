import Product from "../../models/Product.js";

class ProductRepository {
  async create(data) {
    return await Product.create(data);
  }

  async findAll(filter = {}) {
    console.log("Filter:", filter);

    const products = await Product.find(filter);

    console.log("Products Found:", products.length);

    return products;
  }
  async findById(id) {
    return await Product.findById(id);
  }

  async update(id, data) {
    return await Product.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }

  async search(keyword) {
    return await Product.find({
      name: {
        $regex: keyword,
        $options: "i",
      },
    });
  }
}

export default new ProductRepository();