import repository from "./product.repository.js";
import slugify from "slugify";
import crypto from "crypto";

function generateSku(name) {
  const base = slugify(name || "product", {
    lower: true,
    strict: true,
  });

  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `${base || "product"}-${suffix}`;
}

class ProductService {

  async create(data, files = []) {

    data.slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    if (!data.sku) {
      data.sku = generateSku(data.name);
    }

    if (files.length > 0) {
      data.images = files.map((file) => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename,
      }));
    }

    return repository.create(data);
  }

  getProducts() {
    console.log("Service getProducts called");
    return repository.findAll({
      isActive: true,
    });
  }

  getProduct(id) {
    return repository.findById(id);
  }

  async updateProduct(id, data = {}, files = []) {

    if (data.name) {
      data.slug = slugify(data.name, {
        lower: true,
        strict: true,
      });
    }

    if (data.name && !data.sku) {
      data.sku = generateSku(data.name);
    }

    // New uploaded images
    if (files.length > 0) {
      data.images = files.map((file) => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename,
      }));
    }

    return await repository.update(id, data);
  }

  deleteProduct(id) {
    return repository.delete(id);
  }

  search(keyword) {
    return repository.search(keyword);
  }

}

export default new ProductService();