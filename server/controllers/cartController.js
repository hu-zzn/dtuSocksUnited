import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { supabase } from "../database/supabaseClient.js";
import { mapSocFromDb } from "../models/socModel.js";

// TOGGLE CART CONTROLLER
export const toggleCart = catchAsyncErrors(async (req, res, next) => {
  const { socId } = req.body;

  if (!socId) {
    return next(new ErrorHandler("socId is required", 400));
  }

  // Check if item is already in cart
  const { data: existingItem, error: checkError } = await supabase
    .from("cart_items")
    .select("id")
    .eq("user_id", req.user._id)
    .eq("soc_id", socId)
    .maybeSingle();

  if (checkError) {
    return next(new ErrorHandler(checkError.message, 500));
  }

  if (!existingItem) {
    // Add to cart
    const { error: insertError } = await supabase
      .from("cart_items")
      .insert({ user_id: req.user._id, soc_id: socId });

    if (insertError) {
      return next(new ErrorHandler(insertError.message, 500));
    }

    return res.status(200).json({ success: true, message: "Added to cart" });
  } else {
    // Remove from cart
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", req.user._id)
      .eq("soc_id", socId);

    if (deleteError) {
      return next(new ErrorHandler(deleteError.message, 500));
    }

    return res.status(200).json({ success: true, message: "Removed from cart" });
  }
});

export const showCart = catchAsyncErrors(async (req, res, next) => {
  // Select from cart_items joining societies
  const { data, error } = await supabase
    .from("cart_items")
    .select("societies (*)")
    .eq("user_id", req.user._id);

  if (error) {
    return next(new ErrorHandler(error.message, 500));
  }

  const cart = (data || [])
    .map((item) => mapSocFromDb(item.societies))
    .filter(Boolean);

  res.status(200).json({
    success: true,
    cart,
  });
});
