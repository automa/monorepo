import '@testing-library/jest-dom';
import { vi } from 'vitest';
import fetchMock from 'vitest-fetch-mock';

const fetchMocker = fetchMock(vi);

fetchMocker.enableMocks();
