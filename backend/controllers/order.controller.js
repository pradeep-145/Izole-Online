const orderModel = require("../models/order.model.js");
const { createScheduler, deleteOrderScheduler } = require('../utils/scheduler.js');

exports.OrderController = {
  createOrder: async (req, res) => {
    const { customerId, productId, quantity, address } = req.body;
    try {
      const response = await orderModel.create({
        customerId,
        productId,
        quantity,
        address,
      });
      
      console.log(response);
      const scheduleName = await createScheduler(response._id);

      response.schedulerName = scheduleName;
      await response.save();
      
      res.status(201).json({
        success: true,
        response,
        message: "Order created successfully"
      });
    } catch (error) {
      console.log("Error in creating order", error);
      res.status(500).json({ 
        success: false, 
        message: "Error in creating order" 
      });
    }
  },
  
  getOrders: async (req, res) => {
    const user = req.user;
    try {
      const response = await orderModel.find({ customerId: user._id });

      res.status(200).json({
        success: true,
        response,
        message: "Orders fetched successfully"
      });
    } catch (error) {
      console.log("Error in getting orders", error);
      res.status(500).json({ 
        success: false,
        message: "Error in getting orders" 
      });
    }
  },
  
  confirmOrder: async (req, res) => {
    const { orderId, schedulerName } = req.body;
    
    try {
      // Find the order
      const order = await orderModel.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: "Order not found" 
        });
      }
      
      // Delete the scheduler
      if (schedulerName || order.schedulerName) {
        await deleteOrderScheduler(schedulerName || order.schedulerName);
      }
      
      // Update order status
      order.status = "COMPLETED";
      order.expiresAt = undefined; // Remove expiration
      await order.save();
      
      res.status(200).json({
        success: true,
        response: order,
        message: "Order confirmed successfully"
      });
    } catch (error) {
      console.log("Error in confirming order", error);
      res.status(500).json({ 
        success: false,
        message: "Error in confirming order" 
      });
    }
  },
  
  cancelOrder: async (req, res) => {
    const { orderId, schedulerName } = req.body;
    
    try {
      // Find the order
      const order = await orderModel.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: "Order not found" 
        });
      }
      
      // Delete the scheduler
      if (schedulerName || order.schedulerName) {
        await deleteOrderScheduler(schedulerName || order.schedulerName);
      }
      
      // Update order status
      order.status = "CANCELLED";
      order.expiresAt = undefined; // Remove expiration
      await order.save();
      
      res.status(200).json({
        success: true,
        response: order,
        message: "Order cancelled successfully"
      });
    } catch (error) {
      console.log("Error in canceling order", error);
      res.status(500).json({ 
        success: false,
        message: "Error in canceling order" 
      });
    }
  },
  
  updateOrder: async (req, res) => {
    const { orderId } = req.params;
    const { quantity, address, status, delivery, paymentStatus } = req.body;
    
    try {
      // Find order and verify ownership if needed
      const order = await orderModel.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: "Order not found" 
        });
      }
      
      // Optional: Check if user owns this order
      if (req.user && order.customerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false,
          message: "Not authorized to update this order" 
        });
      }
      
      // Only update fields that were provided
      const updateData = {};
      if (quantity) updateData.quantity = quantity;
      if (address) updateData.address = address;
      if (status) updateData.status = status;
      if (delivery) updateData.delivery = delivery;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;
      
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { $set: updateData },
        { new: true }
      );
      
      res.status(200).json({
        success: true,
        response: updatedOrder,
        message: "Order updated successfully"
      });
    } catch (error) {
      console.log("Error in updating order", error);
      res.status(500).json({ 
        success: false,
        message: "Error in updating order" 
      });
    }
  },
  
  deleteOrder: async (req, res) => {
    const { orderId } = req.params;
    
    try {
      const order = await orderModel.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: "Order not found" 
        });
      }
      
      // Optional: Check if user owns this order
      if (req.user && order.customerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false,
          message: "Not authorized to delete this order" 
        });
      }
      
      // Delete associated scheduler if exists
      if (order.schedulerName) {
        await deleteOrderScheduler(order.schedulerName);
      }
      
      await orderModel.findByIdAndDelete(orderId);
      
      res.status(200).json({
        success: true,
        message: "Order deleted successfully"
      });
    } catch (error) {
      console.log("Error in deleting order", error);
      res.status(500).json({ 
        success: false,
        message: "Error in deleting order" 
      });
    }
  },
  
  // Get a single order by ID
  getOrderById: async (req, res) => {
    const { orderId } = req.params;
    
    try {
      const order = await orderModel.findById(orderId)
        .populate('productId', 'name price description image')
        .populate('customerId', 'name email phone');
        
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }
      
      res.status(200).json({
        success: true,
        response: order,
        message: "Order fetched successfully"
      });
    } catch (error) {
      console.log("Error in getting order", error);
      res.status(500).json({
        success: false,
        message: "Error in getting order"
      });
    }
  }
};