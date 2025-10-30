import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";
import { fields } from "./utils";

const fieldZod = z.enum(fields)

const schema = createSchema({
    "/me": {
        method: "get",
        query: z.object({
            fields: z.array(fieldZod),
            access_token: z.string(),
        }),
        output: z.record(
            fieldZod,
            z.string().or(z.number()).optional()
        )
    },
    "/:id": {
        method: "get",
        query: z.object({
            fields: z.array(fieldZod),
            access_token: z.string(),
        }),
        params: z.object({
            id: z.string(),
        }),
        output: z.record(
            fieldZod,
            z.string().or(z.number()).optional()
        )
    },
});

export const instagramAPI = createFetch({
    baseURL: "https://graph.instagram.com/",
    schema,
});
