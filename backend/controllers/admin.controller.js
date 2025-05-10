const orders = require("../models/order.model.js");
const products = require("../models/product.model.js");
const customer = require("../models/customer.model.js");
const Notification = require("../models/notification.model.js");
const Product = require('../models/product.model'); // Properly importing Product model

const adminController = {
  get: async (req, res) => {
    try {
      const orderResponse = await orders.find({});
      const productsResponse = await products.find({});
      const customerResponse = await customer.find({});
      res.status(200).json({
        orders: orderResponse,
        products: productsResponse,
        customers: customerResponse,
      });
    } catch (error) {
      console.log("Error in admin get", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Enhanced getInventory with filtering, sorting, and pagination
  getInventory: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 100,
        sort = "name",
        order = "asc",
        category,
        color,
        minPrice,
        maxPrice,
        stock,
        query,
      } = req.query;

      // Build filter object
      const filter = {};
      
      // Category filter
      if (category && category !== "all") {
        filter.category = category;
      }
      
      // Color filter
      if (color && color !== "all") {
        filter["variants.color"] = { $regex: new RegExp(color, 'i') };
      }
      
      // Stock filter
      if (stock === "low") {
        filter["variants.sizeOptions.quantity"] = { $gt: 0, $lt: 10 };
      } else if (stock === "out") {
        filter["variants.sizeOptions.quantity"] = 0;
      } else if (stock === "negative") {
        filter["variants.sizeOptions.quantity"] = { $lt: 0 };
      }
      
      // Price range filter
      if (minPrice || maxPrice) {
        filter["variants.sizeOptions.price"] = {};
        if (minPrice) filter["variants.sizeOptions.price"].$gte = Number(minPrice);
        if (maxPrice) filter["variants.sizeOptions.price"].$lte = Number(maxPrice);
      }
      
      // Search query - search in name, description, category, variants.color
      if (query) {
        const searchRegex = new RegExp(query, 'i');
        filter.$or = [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { "variants.color": searchRegex }
        ];
      }
      
      // Build sort object
      const sortObj = {};
      if (sort === "price") {
        // Special handling for price sorting which is nested inside variants
        if (order === "asc") {
          // For simplicity, we'll do this in memory after fetching
          sortObj.name = 1; // Default sort to keep order consistent
        } else {
          sortObj.name = -1;
        }
      } else if (sort === "stock") {
        // Again, for nested fields, we'll sort in memory
        sortObj.name = order === "asc" ? 1 : -1;
      } else {
        // For direct fields like name, category
        sortObj[sort] = order === "asc" ? 1 : -1;
      }

      // Execute query with pagination
      const skip = (Number(page) - 1) * Number(limit);
      
      // Get total count for pagination info
      const total = await products.countDocuments(filter);
      
      // Fetch the inventory with filters and sorting
      let inventory = await products.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit));
      
      // For price and stock sorting, we need to sort in memory since it's nested
      if (sort === "price") {
        inventory = inventory.sort((a, b) => {
          const pricesA = a.variants.flatMap(v => v.sizeOptions.map(so => so.price));
          const pricesB = b.variants.flatMap(v => v.sizeOptions.map(so => so.price));
          
          const minPriceA = Math.min(...pricesA);
          const minPriceB = Math.min(...pricesB);
          
          return order === "asc" ? minPriceA - minPriceB : minPriceB - minPriceA;
        });
      } else if (sort === "stock") {
        inventory = inventory.sort((a, b) => {
          const stockA = a.variants.reduce((sum, v) => 
            sum + v.sizeOptions.reduce((total, so) => total + (so.quantity || 0), 0)
          , 0); // Fixed by adding closing parenthesis and initial value
          
          const stockB = b.variants.reduce((sum, v) => 
            sum + v.sizeOptions.reduce((total, so) => total + (so.quantity || 0), 0)
          , 0); // Fixed by adding closing parenthesis and initial value
          
          return order === "asc" ? stockA - stockB : stockB - stockA;
        });
      }
      
      // Get categories for filters
      const categories = await products.distinct("category");
      
      // Get colors for filters
      const colors = await products.distinct("variants.color");
      
      res.status(200).json({ 
        success: true, 
        inventory,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        },
        filters: {
          categories,
          colors
        }
      });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch inventory" });
    }
  },

  // Enhanced updateInventory to support single and batch updates
  updateInventory: async (req, res) => {
    try {
      const updates = req.body.updates || [req.body]; // Support both single and batch updates
      
      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid update format. Expecting updates array." 
        });
      }

      const results = [];
      const errors = [];

      // Process each update
      for (const update of updates) {
        const { productId, variantIndex, sizeIndex, quantity } = update;
        
        try {
          // Find the product
          const product = await products.findById(productId);

          if (!product) {
            errors.push({ update, message: "Product not found" });
            continue;
          }

          // Find the variant
          if (!product.variants || variantIndex >= product.variants.length) {
            errors.push({ update, message: "Variant not found" });
            continue;
          }

          // Find the size option
          if (!product.variants[variantIndex].sizeOptions || 
              sizeIndex >= product.variants[variantIndex].sizeOptions.length) {
            errors.push({ update, message: "Size option not found" });
            continue;
          }

          // Update the quantity
          product.variants[variantIndex].sizeOptions[sizeIndex].quantity = quantity;
          await product.save();

          // Record successful update
          results.push({
            productId,
            variantIndex,
            sizeIndex,
            quantity,
            success: true
          });
        } catch (error) {
          console.error("Error updating inventory item:", error);
          errors.push({ update, message: error.message });
        }
      }

      res.status(200).json({
        success: errors.length === 0,
        message: `Updated ${results.length} items${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
        results,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to update inventory",
        error: error.message 
      });
    }
  },

  // Fix inventory issues (like negative stock)
  fixInventoryIssues: async (req, res) => {
    try {
      // Find all products with negative stock
      const productsWithNegativeStock = await products.find({
        "variants.sizeOptions.quantity": { $lt: 0 }
      });

      const updates = [];

      // Create updates to fix negative stock
      productsWithNegativeStock.forEach(product => {
        product.variants.forEach((variant, variantIndex) => {
          variant.sizeOptions.forEach((sizeOption, sizeIndex) => {
            if (sizeOption.quantity < 0) {
              updates.push({
                productId: product._id,
                variantIndex,
                sizeIndex,
                quantity: 0, // Reset to zero
                previousValue: sizeOption.quantity
              });
            }
          });
        });
      });

      // Apply the updates
      if (updates.length > 0) {
        for (const update of updates) {
          const { productId, variantIndex, sizeIndex } = update;
          await products.updateOne(
            { _id: productId },
            { 
              $set: {
                [`variants.${variantIndex}.sizeOptions.${sizeIndex}.quantity`]: 0
              }
            }
          );
        }
      }

      res.status(200).json({
        success: true,
        message: `Fixed ${updates.length} inventory issues`,
        issues: updates
      });
    } catch (error) {
      console.error("Error fixing inventory issues:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fix inventory issues",
        error: error.message 
      });
    }
  },

  // Get inventory statistics
  getInventoryStats: async (req, res) => {
    try {
      // Count total products
      const totalProducts = await products.countDocuments();
      
      // Count variants
      const variantsStats = await products.aggregate([
        { $unwind: "$variants" },
        { $count: "count" }
      ]);
      const totalVariants = variantsStats.length > 0 ? variantsStats[0].count : 0;
      
      // Count size options
      const sizeStats = await products.aggregate([
        { $unwind: "$variants" },
        { $unwind: "$variants.sizeOptions" },
        { $count: "count" }
      ]);
      const totalSizeOptions = sizeStats.length > 0 ? sizeStats[0].count : 0;
      
      // Count products with low stock (< 10 but > 0)
      const lowStockProducts = await products.aggregate([
        { $unwind: "$variants" },
        { $unwind: "$variants.sizeOptions" },
        { $match: { "variants.sizeOptions.quantity": { $gt: 0, $lt: 10 } } },
        { $group: { _id: "$_id" } },
        { $count: "count" }
      ]);
      const lowStockCount = lowStockProducts.length > 0 ? lowStockProducts[0].count : 0;
      
      // Count products with zero stock
      const zeroStockProducts = await products.aggregate([
        { $unwind: "$variants" },
        { $unwind: "$variants.sizeOptions" },
        { $match: { "variants.sizeOptions.quantity": 0 } },
        { $group: { _id: "$_id" }},
        { $count: "count" }
      ]);
      const outOfStockCount = zeroStockProducts.length > 0 ? zeroStockProducts[0].count : 0;

      // Count products with negative stock (errors)
      const negativeStockProducts = await products.aggregate([
        { $unwind: "$variants" },
        { $unwind: "$variants.sizeOptions" },
        { $match: { "variants.sizeOptions.quantity": { $lt: 0 } } },
        { $group: { _id: "$_id" } },
        { $count: "count" }
      ]);
      const negativeStockCount = negativeStockProducts.length > 0 ? negativeStockProducts[0].count : 0;
      
      // Calculate total inventory value
      const inventoryValue = await products.aggregate([
        { $unwind: "$variants" },
        { $unwind: "$variants.sizeOptions" },
        { 
          $project: { 
            value: { 
              $multiply: ["$variants.sizeOptions.quantity", "$variants.sizeOptions.price"] 
            } 
          } 
        },
        { $group: { _id: null, totalValue: { $sum: "$value" } } }
      ]);
      const totalValue = inventoryValue.length > 0 ? inventoryValue[0].totalValue : 0;

      res.status(200).json({
        success: true,
        stats: {
          totalProducts,
          totalVariants,
          totalSizeOptions,
          lowStockCount,
          outOfStockCount,
          negativeStockCount,
          totalValue
        }
      });
    } catch (error) {
      console.error("Error getting inventory stats:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to get inventory statistics",
        error: error.message 
      });
    }
  },

  // Fetch orders
  getOrders: async (req, res) => {
    try {
      const ordersList = await orders.find({}).populate("customerId");
      res.status(200).json({ success: true, orders: ordersList });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch orders" });
    }
  },

  // Update order status
  updateOrders: async (req, res) => {
    const { orderId, status } = req.body;
    try {
      const updatedOrder = await orders.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      // Create a notification for the customer when order status changes
      if (updatedOrder) {
        const newNotification = new Notification({
          customerId: updatedOrder.customerId,
          title: `Order Status Update`,
          message: `Your order #${orderId.slice(
            -6
          )} has been updated to ${status}`,
          type: "order",
          read: false,
        });

        await newNotification.save();
      }

      res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error("Error updating order status:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update order status" });
    }
  },

  // Get customers
  getCustomers: async (req, res) => {
    try {
      const customers = await customer.find({});
      res.status(200).json({ success: true, customers });
    } catch (error) {
      console.error("Error fetching customers:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch customers" });
    }
  },

  // Get customer details
  getCustomerDetails: async (req, res) => {
    const { customerId } = req.params;
    try {
      const customerDetails = await customer.findById(customerId);
      const customerOrders = await orders.find({ customerId });

      if (!customerDetails) {
        return res
          .status(404)
          .json({ success: false, message: "Customer not found" });
      }

      res.status(200).json({
        success: true,
        customer: customerDetails,
        orders: customerOrders,
      });
    } catch (error) {
      console.error("Error fetching customer details:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch customer details" });
    }
  },

  saveProduct: async (req, res) => {
    try {
      // Updated to use new product structure with variants
      const { name, description, category, variants, weight } = req.body;
      console.log(req.body);

      const product = new Product({
        name,
        description,
        category,
        variants,
        orderCount: 0,
        review: [],
      });

      await product.save();
      res
        .status(200)
        .json({ message: "Product added successfully", product: product });
    } catch (error) {
      console.log("Error at saveProduct", error);
      res.status(500).json("Internal server Error");
    }
  },

  // Update product
  updateProduct: async (req, res) => {
    try {
      const { productId, name, description, category, variants } = req.body;

      const updatedProduct = await products.findByIdAndUpdate(
        productId,
        { name, description, category, variants },
        { new: true }
      );

      if (!updatedProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update product" });
    }
  },

  // Remove product
  removeProduct: async (req, res) => {
    try {
      const { productId } = req.body;

      const deletedProduct = await products.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete product" });
    }
  },

  // Get dashboard analytics - improved with detailed stats
  getDashboardAnalytics: async (req, res) => {
    try {
      // Get date ranges
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Format dates for comparison
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));
      const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
      const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999));

      // Get orders for different time periods
      const todayOrders = await orders.find({
        createdAt: { $gte: todayStart, $lte: todayEnd }
      });
      
      const yesterdayOrders = await orders.find({
        createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd }
      });
      
      const recentOrders = await orders
        .find({
          createdAt: { $gte: thirtyDaysAgo },
        })
        .populate("customerId")
        .sort({ createdAt: -1 }) // Most recent first
        .limit(10);

      // Calculate sales figures
      const todaySales = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const yesterdaySales = yesterdayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      // Calculate growth rates
      const salesGrowth = yesterdaySales === 0 
        ? 100 
        : ((todaySales - yesterdaySales) / yesterdaySales) * 100;
      
      const ordersGrowth = yesterdayOrders.length === 0 
        ? 100 
        : ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100;

      // Get new customers today and yesterday
      const todayCustomers = await customer.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd }
      });
      
      const yesterdayCustomers = await customer.countDocuments({
        createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd }
      });
      
      const customersGrowth = yesterdayCustomers === 0 
        ? 100 
        : ((todayCustomers - yesterdayCustomers) / yesterdayCustomers) * 100;

      // Get low stock products - improved to check sizeOptions
      const lowStockProducts = await products.aggregate([
        // Unwind variants array
        { $unwind: "$variants" },
        // Unwind sizeOptions array
        { $unwind: "$variants.sizeOptions" },
        // Match where quantity is low
        { $match: { "variants.sizeOptions.quantity": { $lt: 10, $gte: 0 } } },
        // Group back by product
        { $group: { _id: "$_id" } },
        // Count unique products
        { $count: "count" }
      ]);

      const lowStockCount = lowStockProducts.length > 0 ? lowStockProducts[0].count : 0;

      // Get products with negative inventory (likely errors to fix)
      const negativeStockProducts = await products.aggregate([
        { $unwind: "$variants" },
        { $unwind: "$variants.sizeOptions" },
        { $match: { "variants.sizeOptions.quantity": { $lt: 0 } } },
        { $group: { _id: "$_id" } },
        { $count: "count" }
      ]);

      const negativeStockCount = negativeStockProducts.length > 0 ? negativeStockProducts[0].count : 0;

      // Get top selling products
      const topProducts = await products
        .find()
        .sort({ orderCount: -1 })
        .limit(5);

      // Get pending notifications count
      const notificationsCount = await Notification.countDocuments({ read: false });
      
      // Get pending returns/issues count (if you have a returns model)
      const pendingReturns = 0; // Replace with actual query if you have returns functionality

      // Format data for response
      const analyticsData = {
        sales: {
          today: todaySales,
          yesterday: yesterdaySales,
          growth: salesGrowth
        },
        orders: {
          today: todayOrders.length,
          yesterday: yesterdayOrders.length,
          growth: ordersGrowth,
          total30Days: recentOrders.length
        },
        customers: {
          today: todayCustomers,
          yesterday: yesterdayCustomers,
          growth: customersGrowth,
          total: await customer.countDocuments()
        },
        inventory: {
          lowStockCount,
          negativeStockCount,
          totalProducts: await products.countDocuments()
        },
        topProducts: topProducts.map(product => ({
          _id: product._id,
          name: product.name,
          totalSold: product.orderCount,
          price: Math.min(...product.variants.flatMap(v => 
            v.sizeOptions.map(so => so.price)
          )),
          stock: product.variants.reduce((total, variant) => 
            total + variant.sizeOptions.reduce((sum, size) => sum + (size.quantity || 0), 0), 0
          )
        })),
        recentOrders: recentOrders.map(order => ({
          _id: order._id,
          orderNumber: order._id.toString().slice(-6),
          createdAt: order.createdAt,
          customer: order.customerId ? {
            name: order.customerId.name || "Guest User",
            email: order.customerId.email
          } : { name: "Guest User", email: order.address?.email || "Unknown" },
          status: order.status,
          totalAmount: order.totalAmount
        })),
        notifications: notificationsCount,
        pendingReturns
      };

      res.status(200).json({
        success: true,
        ...analyticsData
      });
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      res.status(500).json({ success: false, message: "Failed to fetch analytics" });
    }
  },

  // Generate reports for admin dashboard
  generateReport: async (req, res) => {
    try {
      const { format, type, startDate, endDate } = req.query;
      
      // Parse dates
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Default to CSV if format not specified
      const reportFormat = format || 'csv';
      const reportType = type || 'sales';

      let reportData;
      let fileName;

      // Generate different types of reports
      switch (reportType) {
        case 'sales':
          reportData = await generateSalesReport(start, end);
          fileName = `sales-report-${start.toISOString().split('T')[0]}-to-${end.toISOString().split('T')[0]}`;
          break;
        case 'inventory':
          reportData = await generateInventoryReport();
          fileName = `inventory-report-${new Date().toISOString().split('T')[0]}`;
          break;
        case 'customers':
          reportData = await generateCustomersReport(start, end);
          fileName = `customers-report-${new Date().toISOString().split('T')[0]}`;
          break;
        default:
          return res.status(400).json({ success: false, message: "Invalid report type" });
      }

      if (reportFormat === 'csv') {
        // Generate CSV
        const csvContent = generateCSV(reportData);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.csv`);
        return res.status(200).send(csvContent);
      } else if (reportFormat === 'json') {
        return res.status(200).json({
          success: true,
          data: reportData,
          reportType,
          dateRange: { start, end }
        });
      } else {
        return res.status(400).json({ success: false, message: "Unsupported report format" });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ success: false, message: "Failed to generate report" });
    }
  },

  // Bulk update inventory
  bulkUpdateInventory: async (req, res) => {
    try {
      const { updates } = req.body;
      
      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid updates format. Expected array of updates." 
        });
      }

      const results = [];
      const errors = [];

      // Process each update
      for (const update of updates) {
        const { productId, variantIndex, sizeIndex, quantity } = update;
        
        try {
          const product = await products.findById(productId);
          
          if (!product || 
              !product.variants || 
              variantIndex >= product.variants.length || 
              !product.variants[variantIndex].sizeOptions || 
              sizeIndex >= product.variants[variantIndex].sizeOptions.length) {
            errors.push({ update, message: "Product, variant or size not found" });
            continue;
          }
          
          product.variants[variantIndex].sizeOptions[sizeIndex].quantity = quantity;
          await product.save();
          
          results.push({
            productId,
            variantIndex,
            sizeIndex,
            quantity,
            success: true
          });
        } catch (err) {
          errors.push({ update, message: err.message });
        }
      }

      res.status(200).json({
        success: errors.length === 0,
        message: `Updated ${results.length} items with ${errors.length} errors`,
        results,
        errors
      });
    } catch (error) {
      console.error("Error in bulk inventory update:", error);
      res.status(500).json({ success: false, message: "Failed to process bulk updates" });
    }
  },

  // Update inventory item
  updateInventoryItem: async (req, res) => {
    try {
      const { productId, variantIndex, sizeIndex, quantity } = req.body;
      
      // Find the product
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Update the quantity for the specific variant and size
      product.variants[variantIndex].sizeOptions[sizeIndex].quantity = quantity;
      
      // Save the updated product
      await product.save();
      
      res.status(200).json({ 
        success: true, 
        message: "Inventory updated successfully",
        product
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to update inventory", 
        error: error.message 
      });
    }
  }
};

// Helper function to generate sales report
async function generateSalesReport(startDate, endDate) {
  const salesOrders = await orders.find({
    createdAt: { $gte: startDate, $lte: endDate }
  }).populate('customerId');
  
  return salesOrders.map(order => ({
    orderId: order._id,
    orderDate: order.createdAt,
    customerName: order.customerId?.name || "Guest",
    customerEmail: order.customerId?.email || order.address?.email || "N/A",
    total: order.totalAmount,
    status: order.status,
    paymentStatus: order.paymentStatus,
    items: order.products?.length || 0,
    shippingAddress: order.address ? 
      `${order.address.firstName || ''} ${order.address.lastName || ''}, ${order.address.address || ''}, ${order.address.city || ''}, ${order.address.state || ''}, ${order.address.postalCode || ''}` : 
      "No address"
  }));
}

// Helper function to generate inventory report
async function generateInventoryReport() {
  const productList = await products.find();
  
  const inventoryItems = [];
  
  productList.forEach(product => {
    product.variants.forEach((variant, variantIndex) => {
      variant.sizeOptions.forEach((sizeOption, sizeIndex) => {
        inventoryItems.push({
          productId: product._id,
          productName: product.name,
          category: product.category,
          color: variant.color,
          size: sizeOption.size,
          quantity: sizeOption.quantity,
          price: sizeOption.price,
          originalPrice: sizeOption.originalPrice,
          variantIndex,
          sizeIndex,
          hasImages: variant.images?.length > 0
        });
      });
    });
  });
  
  return inventoryItems;
}

// Helper function to generate customers report
async function generateCustomersReport(startDate, endDate) {
  const customers = await customer.find({
    createdAt: { $gte: startDate, $lte: endDate }
  });
  
  // For each customer, get their order count and total spend
  const customerData = await Promise.all(customers.map(async (cust) => {
    const customerOrders = await orders.find({ customerId: cust._id });
    const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    return {
      customerId: cust._id,
      name: cust.name,
      email: cust.email,
      phoneNumber: cust.phoneNumber,
      registeredOn: cust.createdAt,
      orderCount: customerOrders.length,
      totalSpent,
      averageOrderValue: customerOrders.length > 0 ? totalSpent / customerOrders.length : 0,
      lastOrderDate: customerOrders.length > 0 ? 
        customerOrders.sort((a, b) => b.createdAt - a.createdAt)[0].createdAt : 
        null
    };
  }));
  
  return customerData;
}

// Helper function to generate CSV content
function generateCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => 
    Object.values(item).map(value => {
      // Handle values with commas, quotes, etc.
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [headers, ...rows].join('\n');
}

module.exports = adminController;
