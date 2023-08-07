import {
  Httpx,
  Request,
  Get,
  Post,
} from 'https://jslib.k6.io/httpx/0.0.2/index.js';
import { describe } from 'https://jslib.k6.io/functional/0.0.3/index.js';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

const USERNAME = 'TestUser23';
const PASSWORD = 'TestUser23Password';

let session = new Httpx({ baseURL: 'https://test-api.k6.io' });

export const options = {
  thresholds: {
    checks: [{ threshold: 'rate == 1.00', abortOnFail: false }],
  },
  vus: 1,
  iterations: 1,
};

export default function testSuite() {
  describe(`01 Authenticate with ${USERNAME}`, (t) => {
    let resp = session.post(`/auth/token/login/`, {
      username: USERNAME,
      password: PASSWORD,
    });
    t.expect(resp.status)
      .as('Auth status')
      .toBeBetween(200, 204)
      .and(resp)
      .toHaveValidJson()
      .and(resp.json('access'))
      .as('auth token')
      .toBeTruthy();

    let authToken = resp.json('access');
    session.addHeader('Authorization', `Bearer ${authToken}`);
  });

  describe('02. Fetch public crocs', (t) => {
    let responses = session.batch([
      new Get('/public/crocodiles/2/'),
      new Get('/public/crocodiles/3/'),
      new Get('/public/crocodiles/4/'),
      new Get('/public/crocodiles/5/'),
      new Get('/public/crocodiles/6/'),
    ]);
    responses.forEach((response) => {
      t.expect(response.status)
        .as('response status')
        .toEqual(200)
        .and(response)
        .toHaveValidJson()
        .and(response.json('age'))
        .as('croc age')
        .toBeGreaterThan(10);
    });
  });

  describe('03. Create a new crocodile', (t) => {
    let payload = {
      name: `first`,
      sex: randomItem(['M', 'F']),
      date_of_birth: '2000-01-01',
    };

    let resp = session.post(`/my/crocodiles/`, payload);

    t.expect(resp.status)
      .as('Croc creation status')
      .toEqual(201)
      .and(resp)
      .toHaveValidJson();

    session.newCrocId = resp.json('id');
  });

  describe('04. Fetch private crocs', (t) => {
    let response = session.get('/my/crocodiles/');
    t.expect(response.status)
      .as('response status')
      .toEqual(200)
      .and(response)
      .toHaveValidJson()
      .and(response.json().length)
      .as('number of crocs')
      .toEqual(1);
  });

  describe('05. Delete the croc', (t) => {
    let resp = session.delete(`/my/crocodiles/${session.newCrocId}/`);

    t.expect(resp.status).as('Croc delete status').toEqual(204);
  });
}
