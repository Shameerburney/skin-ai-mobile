// API Service for AI Skin Analysis

let currentServerUrl = 'http://192.168.18.8:8000';

export const getServerUrl = () => currentServerUrl;

export const setServerUrl = (url) => {
  let cleaned = url.trim();
  if (cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'http://' + cleaned;
  }
  currentServerUrl = cleaned;
  return currentServerUrl;
};

/**
 * Pings the backend health endpoint
 */
export const checkHealth = async (customUrl = null) => {
  const targetUrl = customUrl || currentServerUrl;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const startTime = Date.now();
    const res = await fetch(`${targetUrl}/api/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const latency = Date.now() - startTime;
    return {
      success: true,
      data,
      latency,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: error.name === 'AbortError' ? 'Connection timed out (4s)' : error.message,
    };
  }
};

/**
 * Sends image to backend for neural network and CV analysis
 */
export const analyzeSkin = async (base64Image, customUrl = null) => {
  const targetUrl = customUrl || currentServerUrl;
  const controller = new AbortController();
  // 60-second timeout for first-time deep learning model inference
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(`${targetUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorBody = await res.text();
      let errorMsg = `Server error (${res.status})`;
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed.detail) errorMsg = parsed.detail;
      } catch (e) {
        if (errorBody) errorMsg = errorBody.slice(0, 100);
      }
      throw new Error(errorMsg);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('AI analysis timed out. The local neural models may still be loading or running heavy inference.');
    }
    throw error;
  }
};
