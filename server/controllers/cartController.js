import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import{ User } from "../models/userModel.js"

// TOGGLE CART CONTROLLER
export const toggleCart = catchAsyncErrors(async (req, res, next) => {
  const { socId } = req.body;

  if (!socId) {
    return next(new ErrorHandler("socId is required", 400));
  }

  const user = await User.findById(req.user._id);

  const index = user.cart.findIndex(
    (id) => id.toString() === socId
  );

  if (index === -1) {
    user.cart.push(socId);
    await user.save();
    return res.status(200).json({ success: true, message: "Added to cart" });
  } else {
    user.cart.splice(index, 1);
    await user.save();
    return res.status(200).json({ success: true, message: "Removed from cart" });
  }
});


export const showCart = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("cart");

  res.status(200).json({
    success: true,
    cart: user.cart,
  });
});
