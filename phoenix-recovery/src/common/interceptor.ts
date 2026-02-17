export function initInterceptor(onSubmission: (body: string) => void) {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const [resource, config] = args;
    if (config?.body && typeof config.body === 'string') onSubmission(config.body);
    return originalFetch(...args);
  };

  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body) {
    if (typeof body === 'string') onSubmission(body);
    return originalSend.apply(this, [body]);
  };
}
