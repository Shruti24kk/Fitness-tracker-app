/**
 * Stub: In a real app you'd implement OAuth and use Google Fit REST APIs.
 * This file exists to show where integrations would live.
 */
export async function fetchGoogleFitMetrics({ accessToken, since }) {
  return {
    steps: 0,
    calories: 0,
    heartRateAvg: 0,
    since
  };
}
