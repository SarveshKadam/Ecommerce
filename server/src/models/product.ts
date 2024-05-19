import { model, Schema } from "mongoose";

export interface IProduct {
  productName: string;
  description: string;
  imageURL: string;
  price: number;
  stock: number;
}

const productSchema = new Schema<IProduct>({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  imageURL: { type: String, required: true },
  price: { type: Number, required: true, min: [0, "Price should be greater than 1."] },
  stock: { type: Number, required: true, min: [0, "Stock should be greater than 1."] },
});

export const ProductModel = model<IProduct>("product", productSchema);
