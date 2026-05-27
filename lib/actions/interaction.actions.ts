"use server";

import connectDB from "@/lib/mongodb";
import InteractionModel from "@/models/Interaction";
import ProductModel from "@/models/Product";
import WhatsAppLogModel from "@/models/WhatsAppLog";

export interface GetInteractionsParams {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetches general user interactions with optional filtering and pagination
 */
export async function getInteractions(params: GetInteractionsParams = {}) {
  try {
    await connectDB();
    const { search, type, page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (type && type !== "all") {
      query.interactionType = type;
    }

    // Since searching interactions often involves product names, 
    // we fetch interactions first and then filter/map if needed, 
    // or we fetch product IDs first if searching by product name.
    if (search) {
      const products = await ProductModel.find({
        name: { $regex: search, $options: "i" },
        deletedAt: null,
      }).select("id");

      const productIds = products.map((product) => product.id);

      query.$or = [
        { productId: { $in: productIds } },
        { userId: { $regex: search, $options: "i" } },
      ];
    }

    const [interactions, total] = await Promise.all([
      InteractionModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      InteractionModel.countDocuments(query),
    ]);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(interactions)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching interactions:", error);
    return { success: false, error: "Failed to fetch interactions" };
  }
}

/**
 * Fetches detailed WhatsApp logs.
 */
export async function getWaLogs(params: GetInteractionsParams = {}) {
  try {
    await connectDB();
    const { search, page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { userId: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const [logs, total] = await Promise.all([
      WhatsAppLogModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WhatsAppLogModel.countDocuments(query),
    ]);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(logs)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching WhatsApp logs:", error);
    return { success: false, error: "Failed to fetch WhatsApp logs" };
  }
}
