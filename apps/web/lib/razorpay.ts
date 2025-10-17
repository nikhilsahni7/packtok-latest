const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let loaderPromise: Promise<void> | null = null;

export const loadRazorpayCheckout = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Razorpay checkout can only be loaded in the browser")
    );
  }

  if (window.Razorpay) {
    return Promise.resolve();
  }

  if (loaderPromise) {
    return loaderPromise;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );

    if (existingScript) {
      if (window.Razorpay) {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Razorpay SDK")),
        {
          once: true,
        }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });

  loaderPromise = promise;

  promise.finally(() => {
    loaderPromise = null;
  });

  return promise;
};
