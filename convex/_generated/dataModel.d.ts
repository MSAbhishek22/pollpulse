// NOTE: hand-written stand-in for the file `npx convex dev` generates.
// Run `npx convex dev` once a Convex project exists to regenerate it.
import type {
  DataModelFromSchemaDefinition,
  DocumentByName,
  TableNamesInDataModel,
} from "convex/server";
import type { GenericId } from "convex/values";
import schema from "../schema.js";

declare const fullDataModel: DataModelFromSchemaDefinition<typeof schema>;

export type Doc<TableName extends TableNamesInDataModel<typeof fullDataModel>> =
  DocumentByName<typeof fullDataModel, TableName>;

export type Id<TableName extends TableNamesInDataModel<typeof fullDataModel>> =
  GenericId<TableName>;

export type AnyDataModel = DataModelFromSchemaDefinition<typeof schema>;

export type DataModel = typeof fullDataModel;
