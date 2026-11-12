// NOTE: hand-written stand-in for the file `npx convex dev` generates.
// Run `npx convex dev` once a Convex project exists to regenerate it.
// (convex 1.49 exports the *Generic builders; the plain names below are
// what codegen aliases them to.)
import {
  actionGeneric,
  httpActionGeneric,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
  mutationGeneric,
  queryGeneric,
} from "convex/server";

export const query = queryGeneric;
export const mutation = mutationGeneric;
export const action = actionGeneric;
export const internalQuery = internalQueryGeneric;
export const internalMutation = internalMutationGeneric;
export const internalAction = internalActionGeneric;
export const httpAction = httpActionGeneric;
