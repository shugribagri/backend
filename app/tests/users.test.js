import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { server } from "../../index.mjs";
import sequelize from "../../utils/database.mjs";
import populateDatabase from "../../utils/populateDatabase.mjs";
import AuthService from "../services/authService.mjs";

const request = supertest(server);

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await populateDatabase();
});

afterAll(async () => {
  if (server && server.close) {
    await new Promise((resolve) => server.close(resolve));
  }
  await sequelize.close();
});

describe("POST /api/v1/users/register", () => {
  it("should create a new user", async () => {
    const user = {
      username: faker.person.fullName(),
      email: faker.internet.email(),
      password: "password",
    };

    const response = await request.post("/api/v1/users/register").send(user);
    expect(response.status).toBe(201);
  });
});

describe("POST /api/v1/users/login", () => {
  it("should login the user", async () => {
    const user = {
      email: "admin@gmail.com",
      password: "admin",
    };

    const response = await request.post("/api/v1/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });
});

describe("GET /api/v1/users/details", () => {
  it("should get all users", async () => {
    const user = await AuthService.createUser({
      username: faker.person.fullName(),
      email: faker.internet.email(),
      password: "password",
    });

    const { token } = await AuthService.loginUser({
      email: user.email,
      password: "password",
    });
    const response = await request
      .get("/api/v1/users/details")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.users).toBeTruthy();
  });
});

describe("DELETE /api/v1/users/:id", () => {
  it("should delete a user", async () => {
    const user = await AuthService.createUser({
      username: faker.person.fullName(),
      email: faker.internet.email(),
      password: "password",
    });

    const { token } = await AuthService.loginUser({
      email: user.email,
      password: "password",
    });

    const response = await request
      .delete(`/api/v1/users/delete/${user.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
