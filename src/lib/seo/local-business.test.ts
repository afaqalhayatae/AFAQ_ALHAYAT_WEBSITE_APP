import { describe, expect, it } from "vitest";
import { buildLocalBusinessSchema } from "./local-business";
import { COMPANY_NAME, GOOGLE_MAPS_URL, PHONE_E164 } from "@/lib/brand/links";

describe("buildLocalBusinessSchema", () => {
  it("builds a LocalBusiness schema from only already-approved brand facts", () => {
    const schema = buildLocalBusinessSchema({ name: "AC Maintenance in Dubai", areaServed: "Dubai" });

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("LocalBusiness");
    expect(schema.name).toBe("AC Maintenance in Dubai");
    expect(schema.areaServed).toBe("Dubai");
    expect(schema.telephone).toBe(PHONE_E164);
    expect(schema.hasMap).toBe(GOOGLE_MAPS_URL);
    expect(schema.parentOrganization).toEqual({ "@type": "Organization", name: COMPANY_NAME });
  });
});
