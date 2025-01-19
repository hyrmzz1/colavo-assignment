import axios from 'axios';

const API_BASE_URL =
  'https://us-central1-colavolab.cloudfunctions.net/requestAssignmentCalculatorData';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export default instance;
