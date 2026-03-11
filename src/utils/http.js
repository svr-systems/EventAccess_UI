export const getHdrs = ({ token = null, useFormData = false } = {}) => {
  const headers = {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": useFormData ? "multipart/form-data" : "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { headers };
};

export const getRsp = (response) => {
  const rsp = response?.data ?? {};

  return {
    message: rsp.message ?? null,
    data: rsp.data ?? null,
    errors: rsp.errors ?? null,
  };
};

const getFirstError = (errors) => {
  if (!errors || typeof errors !== "object") return null;

  const firstKey = Object.keys(errors)[0];
  const val = errors[firstKey];

  if (Array.isArray(val) && val.length) return val[0];
  if (typeof val === "string") return val;

  return null;
};

export const getErr = (error) => {
  const rsp = error?.response?.data ?? {};

  const message = rsp.message ?? null;
  const firstError = getFirstError(rsp.errors);
  const fallback = "Error desconocido";

  if (import.meta.env.DEV) {
    const details = rsp.data ?? null;
    if (details) console.error(details);
  }

  return firstError || message || fallback;
};

export const getApi = (url) => {
  const host = new URL(url).hostname;
  const subdomain = host.split(".")[0];
  return subdomain.replace(/^api/i, "");
};
