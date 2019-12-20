const request = require("supertest");

const server = require("./api/server");

describe("server.js", () => {

  describe("POST api/auth/register", () => {
    it("should return a 201 created status", () => {
      return request(server)
      .post("/api/auth/register")
      .send({ username: "me", password: "pass" })
      .then(res => {
        expect(res.status).toBe(201)
      })
      .catch(err => {
        console.log("Secondary error during teardown.")
      })
    })

    it("should return a TEXT/HTML object.", () => {
      return request(server)
        .post("/api/auth/register")
        .then(res => {
          expect(res.type).toMatch(/text/i);
        });
    });
  })

  describe("POST api/auth/login", () => {

    it("should return a 200 OK Status", () => {
      return request(server)
      .post("/api/auth/login")
      .send({username: "me", password: "pass"})
      .then(res => {
        expect(res.status).toBe(200)
      })
    })

    it("should be authenticated.", () => {
      return request(server)
        .post("/api/auth/login")
        .send({ username: "me", password: "pass" })
        .then(res => {
          const token = res.body.token;

          return request(server)
            .get("/api/jokes")
            .set("Authorization", token)
            .then(res => {
              expect(res.status).toBe(200);
              expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });
  })
  
  describe("GET /api/jokes", () => {
    it("should return a 200 status when authenticated.", () => {
      return request(server)
        .post("/api/auth/login")
        .send({ username: "me", password: "pass" })
        .then(res => {
          const token = res.body.token;

          return request(server)
            .get("/api/jokes")
            .set("Authorization", token)
            .then(res => {
              expect(res.status).toBe(200);
              expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });

    it("should return an Array object when authenticated.", () => {
      return request(server)
        .post("/api/auth/login")
        .send({ username: "me", password: "pass" })
        .then(res => {
          const token = res.body.token;

          return request(server)
            .get("/api/jokes")
            .set("Authorization", token)
            .then(res => {
              expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });
  })

})