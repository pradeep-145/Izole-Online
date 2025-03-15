const CartController = {
  addToCart: async (req, res) => {
    const { productId, quantity } = req.body;
    const user = req.user;
    try {
      const cart = await Cart.findOne({ user });
      if (cart) {
        cart.products.push({ productId, quantity });
        await cart.save();
        res.status(200).json({ message: "Product added to cart" });
      } else {
        const newCart = new Cart({
          user,
          products: [{ productId, quantity }],
        });
        await newCart.save();
        res.status(200).json({ message: "Product added to cart" });
      }
    } catch (error) {
      console.log("Error at addToCart", error);
      res.status(500).json("Internal server Error");
    }
  },
  getCart: async (req, res) => {
    const user = req.user;
    try {
      const cart = await Cart.findOne({ user }).populate("products.productId");
      res.status(200).json({ result: cart });
    } catch (error) {
      console.log("Error at getCart", error);
      res.status(500).json("Internal server Error");
    }
  },
};

module.exports = CartController;