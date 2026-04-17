import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const energyValidator = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
);

export const costValidator = v.union(
  v.literal("free"),
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
);

export const socialValidator = v.union(
  v.literal("solo"),
  v.literal("duo"),
  v.literal("group"),
);

export const locationValidator = v.union(
  v.literal("indoor"),
  v.literal("outdoor"),
  v.literal("any"),
);

export const weatherValidator = v.union(
  v.literal("any"),
  v.literal("sunny"),
  v.literal("rainy"),
  v.literal("cold"),
);

export default defineSchema({
  activities: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    durationMin: v.number(),
    cost: costValidator,
    energy: energyValidator,
    social: socialValidator,
    location: locationValidator,
    weather: weatherValidator,
    tags: v.array(v.string()),
  })
    .index("by_category", ["category"])
    .index("by_location", ["location"]),
});
