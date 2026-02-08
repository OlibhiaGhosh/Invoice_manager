import type { TamboTool } from "@tambo-ai/react";
import { get_all_invoices, get_invoice_graph, text_tool, get_custom_chart_data } from "./tamboFunctions";


export const invoiceTools: TamboTool<any, any, []>[] = [

  {
    name: "get_all_invoices",
    description: "Show all invoices in a table",

    inputSchema: {
      type: "object",
      properties: {},
    } as const,

    outputSchema: {
      type: "object",
      properties: {
        component: { type: "string" },
        props: {
          type: "object",
          properties: {
            columns: {
              type: "array",
              items: { type: "string" },
            },
            data: {
              type: "array",
              items: { type: "object" },
            },
          },
          required: ["columns", "data"],
        },
      },
      required: ["component", "props"],
    } as const,

    tool: get_all_invoices,
  },


  {
    name: "invoice_graph",
    description: "Show invoices as a graph",

    inputSchema: {
      type: "object",
      properties: {},
    } as const,

    outputSchema: {
      type: "object",
      properties: {
        component: { type: "string" },
        props: {
          type: "object",
          properties: {
            nodes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  label: { type: "string" },
                },
                required: ["id", "label"],
              },
            },
            edges: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  from: { type: "string" },
                  to: { type: "string" },
                },
                required: ["from", "to"],
              },
            },
          },
          required: ["nodes", "edges"],
        },
      },
      required: ["component", "props"],
    } as const,

    tool: get_invoice_graph,
  },

  {
    name: "text",
    description: "Return plain text",

    inputSchema: {
      type: "object",
      properties: {},
    } as const,

    outputSchema: {
      type: "string",
    } as const,

    tool: text_tool,
  },

  {
    name: "get_custom_chart",
    description: "Shows a custom chart with sample data.",
    inputSchema: {
      type: "object",
      properties: {},
    } as const,
    outputSchema: {
      type: "object",
      properties: {
        component: { type: "string" },
        props: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  value: { type: "number" },
                },
                required: ["name", "value"],
              },
            },
            title: { type: "string" },
          },
          required: ["data", "title"],
        },
      },
      required: ["component", "props"],
    } as const,
    tool: get_custom_chart_data,
  },
];
