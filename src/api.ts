import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";

const schema = createSchema({
    "/:id": {
        query: z.object({
            fields: z.array(z.string()),
            access_token: z.string(),
        }),
        params: z.object({
            id: z.string(),
        }),
        output: z.object({
            username: z.string(),
        }),
    },
});

export const instagramAPI = createFetch({
    baseURL: "https://graph.instagram.com/v24.0",
    schema,
});
