export function initInterceptor(onSubmission: (data: string) => void) {
  // 1. Intercept Fetch
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const [resource, config] = args;
    if (config?.body && typeof config.body === 'string') {
      onSubmission(config.body);
    }
    return originalFetch(...args);
  };

  // 2. Intercept XMLHttpRequest
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body) {
    if (body && typeof body === 'string') {
      onSubmission(body);
    }
    return originalSend.apply(this, [body]);
  };
}
