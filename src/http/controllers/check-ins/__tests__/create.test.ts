import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user.util";
import { prisma } from "@/lib/prisma";

describe("Create Check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "Apple Academy",
        latitude: -22.7024598,
        longitude: -46.9798305,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -22.7024598,
        longitude: -46.9798305,
      });

    expect(response.statusCode).toEqual(201);
  });
});
