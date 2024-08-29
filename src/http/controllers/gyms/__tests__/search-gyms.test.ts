import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user.util";

describe("Search Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able search gyms by title", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Apple Academy",
        description: "Some description",
        phone: "19999999952",
        latitude: -22.7024598,
        longitude: -46.9798305,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Microsoft Academy",
        description: "Some description",
        phone: "19999999952",
        latitude: -22.7024598,
        longitude: -46.9798305,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        query: "Apple",
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Apple Academy",
      }),
    ]);
  });
});
