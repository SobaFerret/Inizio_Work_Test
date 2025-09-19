// ESM-friendly Jest test using unstable_mockModule

import { jest } from "@jest/globals";
import fs from "node:fs";
import path from "node:path";

// load fixture
const fixture = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "tests/fixtures/serpapi-sample.json"), "utf8")
);

// mock serpapi BEFORE importing the module under test
jest.unstable_mockModule("serpapi", () => ({
    getJson: jest.fn()
}));

// now import the mocked module and our function
const serp = await import("serpapi");
const { searchGoogleOrganic } = await import("../src/search.js");

describe("searchGoogleOrganic()", () => {
    beforeEach(() => {
        // reset mocks between tests
        jest.resetAllMocks();
    });

    test("returns normalized organic results only", async () => {
        serp.getJson.mockResolvedValueOnce(fixture);

        const data = await searchGoogleOrganic({ q: "test" });

        expect(data.query).toBe("test");
        expect(Array.isArray(data.results)).toBe(true);
        expect(data.results.length).toBe(2);
        expect(data.results[0]).toEqual({
            position: 1,
            title: "Example Title 1",
            link: "https://example.com/1",
            snippet: "Example snippet 1"
        });
    });

    test("gracefully handles empty organic_results", async () => {
        serp.getJson.mockResolvedValueOnce({ organic_results: [] });

        const data = await searchGoogleOrganic({ q: "nothing" });
        expect(data.results).toEqual([]);
    });
});
