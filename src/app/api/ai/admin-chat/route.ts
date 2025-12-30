
import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { dbConnect } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ 
        role: 'assistant', 
        content: "<b>System:</b> AI Configuration Missing. Please set the GROQ_API_KEY in your environment variables." 
      });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    await dbConnect();

    // --- DATA AGGREGATION ---

    // 1. Revenue Analysis
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const lastMonthStart = new Date(currentMonthStart);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    const lastMonthEnd = new Date(currentMonthStart);

    const allOrders = await Order.find({ paymentStatus: 'approved' }).select('total createdAt items orderStatus').lean();
    
    let totalRevenue = 0;
    let currentMonthRevenue = 0;
    let lastMonthRevenue = 0;
    const itemSales: Record<string, number> = {};

    allOrders.forEach((order: any) => {
      totalRevenue += order.total || 0;
      
      const orderDate = new Date(order.createdAt);
      if (orderDate >= currentMonthStart) {
        currentMonthRevenue += order.total || 0;
      } else if (orderDate >= lastMonthStart && orderDate < lastMonthEnd) {
        lastMonthRevenue += order.total || 0;
      }

      if (order.items) {
        order.items.forEach((item: any) => {
          if (itemSales[item.name]) {
            itemSales[item.name] += item.quantity;
          } else {
            itemSales[item.name] = item.quantity;
          }
        });
      }
    });

    // 2. Order Status Counts
    const pendingOrders = await Order.countDocuments({ orderStatus: 'processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });

    // 3. User / Customer Analytics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const newUsersLast30Days = await User.countDocuments({ 
      role: 'user', 
      createdAt: { $gte: lastMonthStart } 
    });
    
    // Fetch 5 most recent customers names/emails for context
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email city createdAt')
      .lean();

    // 3. Inventory Analysis (Low Stock)
    const lowStockProducts = await Product.find({ 
      $or: [{ stock: { $lt: 5 } }, { countInStock: { $lt: 5 } }] 
    }).select('name stock countInStock').limit(5).lean();

    // 4. Trending Products (Top 5)
    const sortedTrends = Object.entries(itemSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, qty]) => `${name} (${qty} sold)`)
      .join(', ');

    // 5. Recent Orders List (Last 5)
    const recentOrdersList = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('user total orderStatus createdAt items.name')
      .populate('user', 'name email')
      .lean();

    // 6. Top Spenders (VIP Customers)
    // We can aggregate from 'allOrders' which we already fetched
    const userSpendMap: Record<string, { name: string, email: string, totalSpent: number, orderCount: number }> = {};
    
    // Convert allOrders to a map for users. 
    // *NOTE*: allOrders only has user ID if populated. But we fetched it with lean(). 
    // Let's refetch just what we need for this or rely on a new aggregation. 
    // Aggregation is better for performance.
    
    const topSpenders = await Order.aggregate([
      { $match: { paymentStatus: 'approved' } },
      { $group: { 
          _id: "$user", 
          totalSpent: { $sum: "$total" }, 
          orderCount: { $sum: 1 } 
        } 
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "userInfo" } },
      { $unwind: "$userInfo" },
      { $project: { 
          name: "$userInfo.name", 
          email: "$userInfo.email", 
          totalSpent: 1, 
          orderCount: 1 
        } 
      }
    ]);

    // 7. Overall Inventory Price Analysis
    const inventoryStats = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: {
          _id: null,
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          totalActive: { $sum: 1 }
        }
      }
    ]);

    const cheaperProducts = await Product.find({ status: 'active' })
      .sort({ price: 1 })
      .limit(5)
      .select('name price categories')
      .lean();

    const categoryPriceStats = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: {
          _id: "$categories",
          avgPrice: { $avg: "$price" },
          count: { $sum: 1 }
        }
      },
      { $unwind: "$_id" },
      { $group: {
          _id: "$_id",
          avgPrice: { $avg: "$avgPrice" },
          count: { $sum: "$count" }
        }
      },
      { $limit: 10 }
    ]);

    // --- CONSTRUCT CONTEXT ---

    const businessData = `
    **FINANCIAL SNAPSHOT:**
    - Total All-Time Revenue: $${totalRevenue.toFixed(2)}
    - This Month Revenue: $${currentMonthRevenue.toFixed(2)}
    - Last Month Revenue: $${lastMonthRevenue.toFixed(2)}
    - Growth Trend: ${currentMonthRevenue > lastMonthRevenue ? 'UP' : 'DOWN'} vs last month.

    - Total Customers: ${totalUsers}
    - New Signups (Last 30 Days): ${newUsersLast30Days}

    **ORDER STATUS & RECENT ACTIVITY:**
    - Processing (Needs Action): ${pendingOrders}
    - Shipped: ${shippedOrders}
    - Delivered: ${deliveredOrders}
    - RECENT ORDERS:
    ${recentOrdersList.map((o: any) => `- #${o._id.toString().slice(-6)} | ${o.user?.name || 'Guest'} | $${(o.total || 0).toFixed(2)} | ${o.orderStatus}`).join('\n    ')}

    **CUSTOMER INSIGHTS:**
    - Latest Signups:
    ${recentUsers.map((u: any) => `- ${u.name} (${u.email}) | ${new Date(u.createdAt).toLocaleDateString()}`).join('\n    ')}
    
    **VIP CUSTOMERS (TOP SPENDERS):**
    ${topSpenders.map((u: any) => `- ${u.name} | $${u.totalSpent.toFixed(2)} (${u.orderCount} ord)`).join('\n    ')}

    **INVENTORY & PRICING:**
    - Total Active Items: ${inventoryStats[0]?.totalActive || 0}
    - Catalog Range: $${(inventoryStats[0]?.minPrice || 0).toFixed(2)} to $${(inventoryStats[0]?.maxPrice || 0).toFixed(2)} (Avg: $${(inventoryStats[0]?.avgPrice || 0).toFixed(2)})
    - Lowest Priced Items: ${cheaperProducts.map((p: any) => `${p.name} ($${p.price})`).join(', ')}
    - Category Avgs: ${categoryPriceStats.map((c: any) => `${c._id}: $${c.avgPrice.toFixed(0)}`).join(' | ')}
    - Top Sellers: ${sortedTrends || 'No sales data yet'}
    - Low Stock: ${lowStockProducts.map((p: any) => `${p.name} (${p.stock || 0})`).join(', ') || 'None'}
    `;

    const systemPrompt = `
      You are the **AI Business Strategist** for Sara Jewelers.
      
      **CRITICAL INSTRUCTION:**
      - **BE EXTREMELY CONCISE.** Use bullet points. No long introductory sentences.
      - **STOP TALKING TOO MUCH.** If the user asks for data, give the data and a 1-sentence insight. 
      - **PRICE ANALYSIS:** If sales are low, analyze the "INVENTORY & PRICING" data. Identify lowest items for potential promotions.
      
      **REAL-TIME DATA:**
      ${businessData}

      **GUIDELINES:**
      1. **Directness:** Instead of "I have looked at your data and found that...", say "Summary: Revenue is $X. Low stock on Y."
      2. **Insights:** "Category X avg price is $Y. This is high for entry-level customers. Recommend a $Z promo."
      3. **Format:** Use HTML (<b>, <ul>, <br>). No MarkDown.
    `;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.6,
      max_tokens: 400,
    });

    return NextResponse.json({ 
      role: 'assistant',
      content: response.choices[0].message.content 
    });

  } catch (error: any) {
    console.error("Admin AI Error:", error);
    return NextResponse.json({ 
      role: 'assistant',
      content: "I'm having trouble accessing the secure database records right now. Please check the logs."
    });
  }
}
