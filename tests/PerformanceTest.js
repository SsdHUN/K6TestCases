import { Httpx, Get } from 'https://jslib.k6.io/httpx/0.0.2/index.js';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(90)<5000'],
    http_req_duration: ['p(95)<5500'],
    http_req_duration: ['p(99)<6000'],
  },
  scenarios: {
    LoadTest: {
      executor: 'constant-vus',
      exec: 'login',
      vus: 10,
      duration: '30s',
    },
    StresTest: {
      executor: 'constant-vus',
      exec: 'publicCrocs',
      startTime: '35s',
      vus: 100,
      duration: '30s',
    },
    EnduranceTest: {
      executor: 'ramping-vus',
      exec: 'firstPublicCrocs',
      startVUs: 0,
      startTime: '90s',
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1800s', target: 10 },
        { duration: '30s', target: 0 },
      ],
    },
  },
};

const USERNAME = 'TestUser23';
const PASSWORD = 'TestUser23Password';

let session = new Httpx({ baseURL: 'https://test-api.k6.io' });

export function login() {
  const respons = session.post(`/auth/token/login/`, {
    username: USERNAME,
    password: PASSWORD,
  });

  check(respons, {
    'satus was Between 200-204': (r) =>
      r.status >= 200 && r.status <= 204,
  });
}

export function publicCrocs() {
  let responses = session.batch([
    new Get('/public/crocodiles/2/'),
    new Get('/public/crocodiles/3/'),
    new Get('/public/crocodiles/4/'),
    new Get('/public/crocodiles/5/'),
    new Get('/public/crocodiles/6/'),
  ]);

  responses.forEach((respons) => {
    check(respons, {
      'status was 200': (r) => r.status == 200,
    });
  });
}

export function firstPublicCrocs() {
  let respons = session.batch([new Get('/public/crocodiles/1/')]);

  check(respons, {
    'status was 200': (r) => r.status == 200,
  });
}
