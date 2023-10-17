import app from "../../../index";
import request from "supertest";

module.exports = () => {
  describe("POST create User", () => {
    // afterAll(async () => {
    //   await new Promise(resolve => setTimeout(() => resolve(), 10000)); // avoid jest open handle error
    // });
    it("it should fail with 400 if email is missing", async (done) => {
      const body = {
        firstName: "David",
        lastName: "Escudero",
        password: "password",
        phone: "1159441529",
        country: "Argentina",
      };
      try {
        await request(app)
          .post("/v1/users")
          .send(body);
        done();
      } catch (err) {
        expect(error.status).toBe(400);
        expect(error.message).toBe(
          "notNull Violation: User.email cannot be null"
        );
        done();
      }
    });
    it("it should fail with 400 if email is empty", async (done) => {
      const body = {
        firstName: "David",
        lastName: "Escudero",
        password: "password",
        phone: "1159441529",
        country: "Argentina",
        email: "",
      };
      try {
        await request(app)
          .post("/v1/users")
          .send(body);
        done();
      } catch (err) {
        expect(error.status).toBe(400);
        expect(error.message).toBe(
          "notNull Violation: User.email cannot be null"
        );
        done();
      }
    });
    it("it should success with 201 status and return user if this was created", async (done) => {
      const body = {
        firstName: "David",
        lastName: "Escudero",
        password: "password",
        phone: "1159441529",
        country: "Argentina",
        email: "lucas@mail.com",
      };
      try {
        const result = await request(app)
          .post("/v1/users")
          .send(body);
        expect(result.status).toBe(201);
        done();
      } catch (err) {
        done(err);
      }
    });
  });
};
