import { Router, Response, Request } from "express";
import { ProductModel } from "../models/product";
import { verifyToken } from "./user";
import { User } from "../models/user";
import { ProductErrors, UserErrors } from "../error";

const router = Router();

router.get("/", verifyToken, async (_, res: Response) => {
  try {
    const products = await ProductModel.find({});
    res.json({ products });
  } catch (error) {
    return res.status(400).json({
      type: error,
    });
  }
});

router.post("/add", async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    await ProductModel.insertMany(data);
    return res.json({ message: "Data added successfully" });
  } catch (error) {
    console.log("e", error);
    return res.status(400).json({
      type: error,
    });
  }
});

router.post("/checkout", verifyToken, async (req: Request, res: Response) => {
  const { customerId, cartItems } = req.body || {};
  const user = await User.findById(customerId);
  if (!user) {
    return res.status(400).json({
      type: UserErrors.NO_USER_FOUND,
    });
  }
  const productIds = Object.keys(cartItems);
  const products = await ProductModel.find({ _id: { $in: productIds } });
  if (productIds?.length !== products?.length) {
    return res.status(400).json({
      type: ProductErrors.NO_PRODUCT_FOUND,
    });
  }
  let totalCost = 0;
  for (let item in cartItems) {
    const product = products.find((product) => String(product._id) === item);
    if (!product) {
      return res.status(400).json({
        type: ProductErrors.NO_PRODUCT_FOUND,
      });
    }

    if (product.stock < cartItems[item]) {
      return res.status(400).json({
        type: ProductErrors.STOCK_EMPTY,
      });
    }
    totalCost += product.price * cartItems[item];
  }

  if (totalCost > user.availableAmount) {
    return res.status(400).json({
      type: UserErrors.NOT_ENOUGH_BALANCE,
    });
  }

  user.availableAmount -= totalCost;
  user.purchasedItems.push(...productIds);
  await user.save();
  await ProductModel.updateMany(
    { _id: { $in: productIds } },
    { $inc: { stockQuantity: -1 } }
  );

  res.json({ purchasedItems: user.purchasedItems });
});

export { router as productRouter };
