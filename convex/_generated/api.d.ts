// NOTE: hand-written stand-in for the file `npx convex dev` generates.
// Run `npx convex dev` once a Convex project exists to regenerate it.
import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as polls from "../polls.js";

/**
 * A utility for referencing Convex functions in your app. The types here are
 * the public API of your app.
 */
declare const fullApi: ApiFromModules<{
  polls: typeof polls;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
