import "dotenv/config";
import express from "express";
import cors from "cors";
import { querySchema } from "./validators.js";
import { searchGoogleOrganic } from "./search.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/search", async (req, res) => {
    try {
        const { q } = querySchema.parse({ q: (req.query.q || "").toString() });
        const data = await searchGoogleOrganic({ q });
        res.json(data);
    } catch (err) {
        const status = err.name === "ZodError" ? 400 : 500;
        res.status(status).json({ error: err.message ?? "Internal error" });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
