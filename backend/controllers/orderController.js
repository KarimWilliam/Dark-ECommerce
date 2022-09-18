import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import paypal from "@paypal/checkout-server-sdk";
dotenv.config();
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

const Environment =
  process.env.NODE_ENV === "false" //IMPORTANT    THIS NEEDS TO BE SET TO LIVE ENVIORNMENT FOR REAL MONEY TRANSACTIONS
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

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
      element._id = element.product._id;
      // console.log("element: " + JSON.stringify(element));
      orderItemss.push(flattenObject(element));
      // console.log(
      //   "Flattened element: " + JSON.stringify(flattenObject(element))
      // );
    });
    orderItemss.forEach((element) => {
      delete Object.assign(element, { ["product"]: element["_id"] })["_id"];
    });

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
        const updatedOrder = await order.save();

        res.json(updatedOrder);
      }
    } else {
      res.status(404);
      throw new Error("Order not found or not paid");
    }
  } catch (error) {
    res.json(order);
  }
});

// @desc    Update order to paid
// @route   POST /api/orders/:id/pay
// @access  Private
const updateOrderToPaidPaypal = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const request = new paypal.orders.OrdersCaptureRequest(req.body.paypalID);
  request.requestBody({});
  // Call API with your client and get a response for your call
  let response = await paypalClient.execute(request);
  // If call returns body in response, you can get the deserialized version from the result attribute of the response.
  //console.log(`Capture: ${JSON.stringify(response.result)}`);
  if (order) {
    order.paymentResult = {
      id: req.body.paypalID,
      status: response.result.status,
      update_time: Date.now(),
      email_address: response.result.payment_source.paypal.email_address,
    };
    if (response.result.status == "COMPLETED") {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(500).json("something happened");
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

// @desc   Make Payment with paypal
// @route   POST /api/orders/paypal/:id
// @access  Private
const paypalPayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    let i = order.orderItems.length;

    while (i--) {
      let prod = await Product.findById(order.orderItems[i].product.toString());
      prod.countInStock = prod.countInStock - order.orderItems[i].qty;
      await prod.save();
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: order.totalPrice,
            breakdown: {
              tax_total: { currency_code: "USD", value: order.taxPrice },
              shipping: {
                currency_code: "USD",
                value: order.shippingPrice,
              },
              item_total: {
                currency_code: "USD",
                value: (
                  order.totalPrice -
                  order.shippingPrice -
                  order.taxPrice
                ).toFixed(2),
              },
            },
          },
          items: order.orderItems.map((item) => {
            return {
              name: item.name,
              unit_amount: { currency_code: "USD", value: item.price },
              quantity: item.qty,
            };
          }),
        },
      ],
    });
    console.log("order");
    try {
      const paypalOrder = await paypalClient.execute(request);

      res.json({ id: paypalOrder.result.id });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc   Make Payment with Stripe possible
// @route   POST /api/orders/stripe/:id
// @access  Private
const stripePayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  let i = order.orderItems.length;
  if (order) {
    while (i--) {
      let prod = await Product.findById(order.orderItems[i].product.toString());
      prod.countInStock = prod.countInStock - order.orderItems[i].qty;
      //console.log(order.orderItems[i].qty);
      await prod.save();
    }

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

// @desc    finalizes the order before customer pays
// @route   GET /api/orders/:id/finalize
// @access  Private
const finalizeOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email cartItems"
  );
  const user = await User.findById(order.user._id);
  let i = order.orderItems.length;
  const extraItems = [];
  while (i--) {
    let prod = await Product.findById(order.orderItems[i].product.toString());
    if (prod.countInStock < order.orderItems[i].qty) {
      // console.log(order.orderItems[i].qty);
      extraItems.push(order.orderItems[i]);
      order.orderItems.splice(i, 1);
      // if(prod.countInStock===0){}   make it more advanced with setting lower qty
      user.cartItems = user.cartItems.filter(function (item) {
        return item.product != prod._id.toString();
      });
      // console.log(user.cartItems);
    }
  }
  await user.save();
  //await order.save();

  res.json(extraItems);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  stripePayOrder,
  paypalPayOrder,
  updateOrderToPaidPaypal,
  finalizeOrder,
};
