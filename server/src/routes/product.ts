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
    return res.status(400).json({
      type: error,
    });
  }
});

router.post("/checkout", verifyToken, async (req: Request, res: Response) => {
  try {
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
    const bulkOps = [];
    for (const key in cartItems) {
      const productID = key;
      const quantityToDeduct = cartItems[key];
      const updateOperation = {
        updateOne: {
          filter: { _id: productID },
          update: { $inc: { stock: -quantityToDeduct } },
        },
      };
      bulkOps.push(updateOperation);
    }

    await ProductModel.bulkWrite(bulkOps);
    res.json({ purchasedItems: products });
  } catch (error) {
    res.status(500).json({
      type: error,
    });
  }
});

router.get(
  "/purchased-items/:customerID",
  verifyToken,
  async (req: Request, res: Response) => {
    const { customerID } = req.params;
    try {
      const user = await User.findById(customerID);

      if (!user) {
        return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
      }

      const products = await ProductModel.find({
        _id: { $in: user.purchasedItems },
      });

      res.json({ purchasedItems: products });
    } catch (error) {
      res.status(400).json({
        type: error,
      });
    }
  }
);

export { router as productRouter };
