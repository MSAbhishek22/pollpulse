// NOTE: hand-written stand-in for the file `npx convex dev` generates.
// This repo is built without a Convex account (no account creation in the
// sandbox). Once a Convex project exists, run `npx convex dev` and let it
// regenerate this directory — the shape below matches convex 1.49 codegen.
import { anyApi } from "convex/server";

export const api = anyApi;
export const internal = anyApi;
