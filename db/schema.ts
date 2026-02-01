import { not } from "drizzle-orm";
import { pgTable, serial, varchar, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const billing = pgEnum("billing", ["free", "pro", "premium"]);
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  billing: billing("billing").default("free").notNull(),
  company_name: varchar("company_name", { length: 255 }),
  invoices_generated: integer("invoices_generated").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  client_id: serial("client_id").primaryKey(),
  user_id: integer("user_id").references((): any => users.id , { onDelete: "cascade" }).notNull(),
  // invoice_id: integer("invoice_id").references((): any => invoices.invoice_id , { onDelete: "cascade" }),
  client_company_name: varchar("client_company_name", { length: 255 }).notNull(),
  client_email: varchar("client_email", { length: 255 }).notNull(),
  client_address: text("client_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const invoices = pgTable("invoices", {
  invoice_id: serial("invoice_id").primaryKey(),
  user_id: integer("user_id").references((): any => users.id , { onDelete: "cascade" }).notNull(),
  client_id: integer("client_id").references((): any => clients.client_id , { onDelete: "cascade" }).notNull(),
  user_company_name: varchar("user_company_name", { length: 255 }).notNull(),
  issue_date: timestamp("issue_date").notNull(),
  due_date: timestamp("due_date").notNull(),
  items: text("items").notNull(), // [{id, description, qty, price}]
  total_amount: integer("total_amount").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  notes: text("notes"),
});

export const saved_details = pgTable("saved_details", {
  invoice_id: integer("invoice_id").references((): any => invoices.invoice_id , { onDelete: "cascade" }).notNull().primaryKey(),
  user_id: integer("user_id").references((): any => users.id , { onDelete: "cascade" }).notNull(),
  client_id: integer("client_id").references((): any => clients.client_id , { onDelete: "cascade" }).notNull(),
});

