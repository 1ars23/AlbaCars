const app = require('./index');

let server;

beforeAll(() => {
    server = app.listen(3001);
});

afterAll(async () => {
    await server.close();
});

module.exports = server;
