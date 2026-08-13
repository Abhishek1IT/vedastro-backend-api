import ProductService from "./product.service.js";
import ApiError from "../../utils/ApiError.js";

class ProductController {
  // Create Product
  async create(req, res, next) {
    try {
      const product = await ProductService.create(
        req.body,
        req.files || []
      );

      return res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get All Products
  async getProducts(req, res, next) {
    try {
      const products = await ProductService.getProducts(req.query);

      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Single Product
  async getProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await ProductService.getProduct(id);

      return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update Product
  async updateProduct(req, res, next) {
    try {

      const product = await ProductService.updateProduct(
        req.params.id,
        req.body,
        req.files,
      );

      return res.status(200).json({
        success: true,
        data: product
      });

    } catch (error) {
      next(error);
    }
  }

  // Delete Product
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      await ProductService.deleteProduct(id);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Search Products
  async search(req, res, next) {
    try {
      const { keyword } = req.params;

      const products = await ProductService.search(keyword);

      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();