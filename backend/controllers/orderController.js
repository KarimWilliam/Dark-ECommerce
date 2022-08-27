import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    console.log("hi");

    const flattenObject = (obj) => {
      const flattened = {};

      Object.keys(obj).forEach((key) => {
        const value = obj[key];

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          Object.assign(flattened, flattenObject(value));
        } else {
          flattened[key] = value;
        }
      });

      return flattened;
    };

    let orderItemss = [];
    orderItems.forEach((element) => {
      orderItemss.push(flattenObject(element));
    });

    orderItemss.forEach((element) => {
      delete Object.assign(element, { ["product"]: element["_id"] })["_id"];
    });

    console.log("order items after renaming");

    const order = new Order({
      orderItems: orderItemss,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  try {
    const session = await stripe.checkout.sessions.retrieve(
      order.paymentResult.id
    );

    if (order) {
      order.paymentResult = {
        id: order.paymentResult.id,
        status: session.payment_status,
        // update_time: req.body.update_time,
        // email_address: session.customer_email
      };
      if (session.payment_status == "paid") {
        order.isPaid = true;
        if (!order.paidAt) {
          order.paidAt = Date.now();
        }
      }

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.json(order);
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

// @desc   Make Payment with Stripe possible
// @route   POST /api/orders/stripe/:id
// @access  Private
const stripePayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    const taxRate = await stripe.taxRates.create({
      display_name: "VAT",
      description: "sales tax",
      jurisdiction: "US",
      percentage: 15,
      inclusive: false,
    });
    const shippingPrice = order.shippingPrice * 100;

    try {
      //create the sessions
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: order.user.email, //need proper formatted emails to work
        customer: order.user._id,
        shipping_options: [
          {
            shipping_rate_data: {
              display_name: "Cost",
              type: "fixed_amount",
              fixed_amount: { amount: shippingPrice, currency: "usd" },
            },
          },
        ],
        success_url: `${process.env.FRONTEND_URL}${req.params.id}`,
        cancel_url: `${process.env.FRONTEND_URL}${req.params.id}`,
        line_items: order.orderItems.map((item) => {
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
              },
              unit_amount: Number(item.price) * 100,
            },
            quantity: item.qty,
            tax_rates: [taxRate.id],
          };
        }),
      });

      // save data to my order
      order.paymentResult = {
        id: session.id,
      };

      await order.save();

      res.json({ url: session.url });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  stripePayOrder,
};
