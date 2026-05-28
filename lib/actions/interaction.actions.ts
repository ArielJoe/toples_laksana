"use server";

import connectDB from "@/lib/mongodb";
import InteractionModel from "@/models/Interaction";
import ProductModel from "@/models/Product";
import WhatsAppLogModel from "@/models/WhatsAppLog";
import UserModel from "@/models/User";

export interface GetInteractionsParams {
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetches general user interactions with optional filtering and pagination
 */
export async function getInteractions(params: GetInteractionsParams = {}) {
  try {
    await connectDB();
    const { search, page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (search) {
      const [products, matchingUsers] = await Promise.all([
        ProductModel.find({
          name: { $regex: search, $options: "i" },
          deletedAt: null,
        }).select("id"),
        UserModel.find({
          $or: [
            { email: { $regex: search, $options: "i" } },
            { fullName: { $regex: search, $options: "i" } },
          ],
        }).select("id"),
      ]);

      const productIds = products.map((product) => product.id);
      const matchingUserIds = matchingUsers.map((user) => user.id);

      query.$or = [
        { productId: { $in: productIds } },
        { userId: { $in: matchingUserIds } },
        { userId: { $regex: search, $options: "i" } }, // Legacy or guest
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

    // Enrich interactions with resolved user email addresses
    const userIds = [...new Set(interactions.map((i) => i.userId).filter(Boolean))];
    const users = await UserModel.find({ id: { $in: userIds } }).select("id email").lean();
    const userMap = Object.fromEntries(users.map((u) => [u.id, u.email]));

    const enrichedInteractions = interactions.map((i) => ({
      ...i,
      userId: userMap[i.userId] || i.userId,
    }));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(enrichedInteractions)),
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
      const matchingUsers = await UserModel.find({
        $or: [
          { email: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
        ],
      }).select("id");
      const matchingUserIds = matchingUsers.map((user) => user.id);

      query.$or = [
        { userId: { $in: matchingUserIds } },
        { userId: { $regex: search, $options: "i" } }, // Legacy or guest
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

    // Enrich logs with resolved user email addresses
    const userIds = [...new Set(logs.map((l) => l.userId).filter(Boolean))];
    const users = await UserModel.find({ id: { $in: userIds } }).select("id email").lean();
    const userMap = Object.fromEntries(users.map((u) => [u.id, u.email]));

    const enrichedLogs = logs.map((l) => ({
      ...l,
      userId: userMap[l.userId] || l.userId,
    }));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(enrichedLogs)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching WhatsApp logs:", error);
    return { success: false, error: "Failed to fetch WhatsApp logs" };
  }
}
