import { getJson } from "serpapi";
import { resultsSchema } from "./validators.js";

export async function searchGoogleOrganic({ q, gl = "cz", hl = "cs", num = 10 }) {
    const params = {
        engine: "google",
        q,
        gl,
        hl,
        num,
        api_key: process.env.SERPAPI_KEY   //Key goes here dummy don't forget to get a new one...
    };

    const raw = await getJson(params);    
    const organic = Array.isArray(raw.organic_results) ? raw.organic_results : [];

    const normalized = {
        query: q,
        fetched_at: new Date().toISOString(),
        source: "google_serpapi",
        results: organic
            .filter(r => r.link && r.title)
            .map(r => ({
                position: r.position,
                title: r.title,
                link: r.link,
                snippet: r.snippet || ""
            }))
    };

    return resultsSchema.parse(normalized);
}
