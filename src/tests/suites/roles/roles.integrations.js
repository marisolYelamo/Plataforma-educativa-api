import request from "supertest";
import app from "../../../index";
import db from "../../../../db";

import "../../../models/assosiations";

import RoleModel from "../../../models/role";
import PermissionModel from "../../../models/permission";
import PermissionTypeModel from "../../../models/permissionType";

import { randomId } from "./utils";
import PermissionRole from "../../../models/permissionRole";

module.exports = async () => {
  beforeAll(function(done) {
    db.sync({ force: true }).then(() => done());
  });

  describe("POST /v1/roles", () => {
    afterAll(function(done) {
      db.sync({ force: true }).then(() => done());
    });

    it("it should fail with 400 if role 'name' is missing or empty.", async (done) => {
      const body = { name: `bc-student-${randomId()}` };

      try {
        await request(app)
          .post("/v1/roles")
          .send(body);

        done();
      } catch (err) {
        expect(error.status).toBe(400);
        expect(error.message).toBe(
          "required parameter is missing or wrong type"
        );

        done();
      }
    });

    it("it should be successful with status 201 and return role if this was created", async (done) => {
      const numRandom = (Math.random() * 10).toString();
      const fakeBody = { name: `bc-student-${numRandom}` };

      try {
        const res = await request(app)
          .post("/v1/roles")
          .send(fakeBody);

        expect(res.status).toBe(201);
        expect(res.body.data.id).toBeTruthy();
        expect(res.body.data.name).toEqual(fakeBody.name);

        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe("POST /v1/roles/:id/permissions/:permissionId", () => {
    let role, permission, typePermissionA;

    beforeAll(async (done) => {
      try {
        typePermissionA = await PermissionTypeModel.create({
          title: "permiso 1",
        });

        permission = await PermissionModel.create({
          typeId: typePermissionA.id,
        });

        role = await RoleModel.create({ name: `test-${randomId()}` });

        done();
      } catch (error) {
        done(err);
      }
    });

    afterAll(function(done) {
      db.sync({ force: true }).then(() => done());
    });

    it("it should fail with status 400 if permissiontId doesn't exist.", async (done) => {
      try {
        const roleId = role.id;
        const fakeId = randomId();
        const message = "The permission you want to add doesn't exist.";

        const res = await request(app).post(
          `/v1/roles/${roleId}/permissions/${fakeId}`
        );

        expect(res.body.status).toBe(400);
        expect(res.body.message).toEqual(message);

        done();
      } catch (err) {
        done(err);
      }
    });

    it("it should fail with status 400 if roleId doesn't exist.", async (done) => {
      try {
        const fakeId = randomId();
        const permissionId = permission.id;
        const message =
          "The role you want to add to a permission doesn't exist.";

        const res = await request(app).post(
          `/v1/roles/${fakeId}/permissions/${permissionId}`
        );

        expect(res.body.status).toBe(400);
        expect(res.body.message).toEqual(message);

        done();
      } catch (err) {
        done(err);
      }
    });

    it("it should be successful with status 201 and add permision to a role.", async (done) => {
      try {
        const roleId = role.id;
        const permissionId = permission.id;
        const message = "Permission added successfully.";

        const res = await request(app).post(
          `/v1/roles/${roleId}/permissions/${permissionId}`
        );

        expect(res.body.status).toBe(201);
        expect(res.body.message).toEqual(message);

        expect(res.body.data.roleId).toEqual(roleId);
        expect(res.body.data.permissionId).toEqual(permissionId);

        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe("GET /v1/roles", () => {
    let roleA, roleB;

    beforeAll(async (done) => {
      roleA = await RoleModel.create({ name: `test-${randomId()}` });
      roleB = await RoleModel.create({ name: `test-${randomId()}` });

      done();
    });

    afterAll(function(done) {
      db.sync({ force: true }).then(() => done());
    });

    it("it should be successful with status 200 and get an array with roles", async (done) => {
      const message = "success.";
      const res = await request(app).get("/v1/roles");

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.message).toEqual(message);

      expect(res.body.data[0].id).toEqual(roleA.id);
      expect(res.body.data[1].id).toEqual(roleB.id);

      done();
    });
  });

  describe("GET /v1/roles/:id", () => {
    let role;

    beforeAll(async (done) => {
      role = await RoleModel.create({ name: `test-${randomId()}` });
      done();
    });

    afterAll(function(done) {
      db.sync({ force: true }).then(() => done());
    });

    it("it should report an error when role does not exists and return status (404)", async (done) => {
      const fakeId = randomId();
      const message = "Role not found";

      const res = await request(app)
        .get(`/v1/roles/${fakeId}`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.message).toEqual(message);

      done();
    });

    it("it should be successful with status 200 and get a role.", async (done) => {
      const roleId = role.id;
      const message = "success.";

      const res = await request(app).get(`/v1/roles/${roleId}`);

      expect(res.body.status).toBe(200);
      expect(res.body.data.id).toEqual(roleId);
      expect(res.body.message).toEqual(message);

      done();
    });
  });

  describe("PUT /v1/roles/:id", () => {
    let role;

    beforeAll(async (done) => {
      role = await RoleModel.create({ name: `test-${randomId()}` });
      done();
    });

    afterAll(function(done) {
      db.sync({ force: true }).then(() => done());
    });

    it("it should replace role data and return status (200)", async (done) => {
      const roleId = role.id;
      const body = { name: "test-updated" };

      const res = await request(app)
        .put(`/v1/roles/${roleId}`)
        .send(body)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data.id).toEqual(roleId);
      expect(res.body.data.name).toEqual(body.name);

      done();
    });

    it("it should report an error when role not exists and return status (404)", async (done) => {
      const roleId = randomId();
      const messagae = "Role not found";
      const body = { name: "test-updated" };

      const res = await request(app)
        .put(`/v1/roles/${roleId}`)
        .send(body)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.message).toEqual(messagae);

      done();
    });
  });

  describe("DELETE /v1/roles/:id", () => {
    let role;

    beforeAll(async (done) => {
      role = await RoleModel.create({ name: `test-${randomId()}` });
      done();
    });

    afterAll(function(done) {
      db.sync({ force: true }).then(() => done());
    });

    it("it should be delete role and successful with status 204", async (done) => {
      const roleId = role.id;

      const res = await request(app)
        .delete(`/v1/roles/${roleId}`)
        .expect(204);

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});

      done();
    });

    it("it should report an error when role does not exists and return status (404)", async (done) => {
      const fakeId = randomId();
      const message = "Role not found";

      const res = await request(app)
        .delete(`/v1/roles/${fakeId}`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.message).toEqual(message);

      done();
    });
  });

  describe("DELETE /v1/roles/:id/permissions/:permissionId", () => {
    let role, permission, typePermissionA;

    beforeAll(async (done) => {
      try {
        typePermissionA = await PermissionTypeModel.create({
          title: "permiso 1",
        });

        permission = await PermissionModel.create({
          typeId: typePermissionA.id,
        });

        role = await RoleModel.create({ name: `test-${randomId()}` });

        await PermissionRole.create({
          permissionId: permission.id,
          roleId: role.id,
        });

        done();
      } catch (error) {
        done(err);
      }
    });

    afterAll(function(done) {
      db.sync({ force: true }).then(() => done());
    });

    it("it should fail with status 400 if permissiontId doesn't exist.", async (done) => {
      try {
        const roleId = role.id;
        const fakeId = randomId();
        const message = "The permission you want to remove doesn't exist.";

        const res = await request(app).delete(
          `/v1/roles/${roleId}/permissions/${fakeId}`
        );

        expect(res.body.status).toBe(400);
        expect(res.body.message).toEqual(message);

        done();
      } catch (err) {
        done(err);
      }
    });

    it("it should fail with status 400 if roleId doesn't exist.", async (done) => {
      try {
        const fakeId = randomId();
        const permissionId = permission.id;
        const message =
          "The role you want to remove to a permission doesn't exist.";

        const res = await request(app).delete(
          `/v1/roles/${fakeId}/permissions/${permissionId}`
        );

        expect(res.body.status).toBe(400);
        expect(res.body.message).toEqual(message);

        done();
      } catch (err) {
        done(err);
      }
    });

    it("it should be successful with status 204 and remove permision to a role.", async (done) => {
      try {
        const roleId = role.id;
        const permissionId = permission.id;
        const message = "deleted successfully.";

        const res = await request(app)
          .delete(`/v1/roles/${roleId}/permissions/${permissionId}`)
          .expect(200);

        expect(res.body.status).toBe(204);
        expect(res.body.message).toEqual(message);

        done();
      } catch (err) {
        done(err);
      }
    });
  });
};
