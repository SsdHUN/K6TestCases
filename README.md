# README for K6 Testcases

This repository contains two k6 test files (`PerdormanceTest.js` and `SmoakTest.js`) for testing the API endpoints of a web application. The tests are written in JavaScript and use the k6 performance testing framework to simulate load, stress, and endurance scenarios. I also use the Smoke test to make sure that the main functions are working properly.

## Prerequisites

Before running the k6 tests, ensure you have the following dependencies installed:

- k6: [installation step by step](https://k6.io/docs/get-started/installation/)

## Smoke Test (SmoakTest.js)

### Purpose

The `SmoakTest.js` test suite is designed to perform a series of API tests against the target application. It covers the following scenarios:

1. Authenticate with a user account.
2. Fetch public crocodiles and validate their age.
3. Create a new crocodile and store its ID.
4. Fetch private crocodiles and verify the number of crocs returned.
5. Delete the previously created crocodile.

## Load, Stress, and Endurance Tests (PerdormanceTest.js)

### Purpose

The `PerdormanceTest.js` test file focuses on three different testing scenarios: Load Test, Stress Test, and Endurance Test. Each scenario simulates different user behavior and request volumes.

1. Load Test: Simulates a constant load of 10 virtual users (VUs) for 30 seconds, executing the login function.
2. Stress Test: Starts with a delay of 35 seconds and then simulates a constant load of 100 VUs for 30 seconds, executing the publicCrocs function.
3. Endurance Test: Starts with a delay of 90 seconds and then ramps up from 0 to 10 VUs over 30 seconds. It maintains this load for another 1800s seconds and then ramps down to 0 VUs over the final 30 seconds, executing the firstPublicCrocs function.

## Running the Tests

1. Install k6 if you haven't already (see Prerequisites).
2. Navigate to the directory containing `PerdormanceTest.js` and `SmoakTest.js`.
3. Run the following command:

```
k6 run name.js
```
