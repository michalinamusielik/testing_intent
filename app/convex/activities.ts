import { v } from "convex/values";
import { query } from "./_generated/server";
import {
  costValidator,
  energyValidator,
  locationValidator,
  socialValidator,
  weatherValidator,
} from "./schema";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("activities").collect();
  },
});

export const match = query({
  args: {
    energy: v.optional(energyValidator),
    cost: v.optional(costValidator),
    social: v.optional(socialValidator),
    location: v.optional(locationValidator),
    weather: v.optional(weatherValidator),
    maxDurationMin: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("activities").collect();
    const limit = args.limit ?? 5;

    const scored = all.map((activity) => {
      let score = 0;
      const reasons: string[] = [];

      if (args.energy && activity.energy === args.energy) {
        score += 3;
        reasons.push(`energy:${activity.energy}`);
      }
      if (args.cost && activity.cost === args.cost) {
        score += 2;
        reasons.push(`cost:${activity.cost}`);
      }
      if (args.social && activity.social === args.social) {
        score += 2;
        reasons.push(`social:${activity.social}`);
      }
      if (
        args.location &&
        (activity.location === args.location || activity.location === "any")
      ) {
        score += 2;
        reasons.push(`location:${activity.location}`);
      }
      if (
        args.weather &&
        (activity.weather === args.weather || activity.weather === "any")
      ) {
        score += 2;
        reasons.push(`weather:${activity.weather}`);
      }
      if (
        args.maxDurationMin !== undefined &&
        activity.durationMin <= args.maxDurationMin
      ) {
        score += 1;
        reasons.push(`fits:${activity.durationMin}min`);
      }
      if (args.tags && args.tags.length > 0) {
        const overlap = activity.tags.filter((t) => args.tags!.includes(t));
        score += overlap.length;
        if (overlap.length > 0) reasons.push(`tags:${overlap.join(",")}`);
      }

      return { activity, score, reasons };
    });

    const filtered = scored
      .filter((entry) => entry.score > 0 || Object.keys(args).length === 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return filtered.map(({ activity, score, reasons }) => ({
      _id: activity._id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      durationMin: activity.durationMin,
      cost: activity.cost,
      energy: activity.energy,
      social: activity.social,
      location: activity.location,
      weather: activity.weather,
      tags: activity.tags,
      score,
      reasons,
    }));
  },
});
