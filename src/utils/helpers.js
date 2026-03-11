export const getCurrentYear = () => new Date().getFullYear();

export const getFormData = (data) => {
  const formData = new FormData();
  const obj = data ?? {};

  for (const key in obj) {
    const value = obj[key];
    const isEmptyString = typeof value === "string" && value.trim() === "";
    const isObject =
      typeof value === "object" && !(value instanceof File) && value !== null;

    formData.append(
      key,
      value == null || isEmptyString
        ? ""
        : isObject
          ? JSON.stringify(value)
          : value,
    );
  }

  return formData;
};

export const extractNestedProp = (target, sourceKey, nestedKey) => {
  if (!target || typeof target !== "object") return target;

  const nested = target?.[sourceKey];
  if (nested && typeof nested === "object") {
    target[`${sourceKey}_${nestedKey}`] = nested?.[nestedKey];
  }

  return target;
};

export const extractMultipleNestedProps = (target, arrayKey, nestedKey) => {
  if (!target || typeof target !== "object") return target;

  const array = target?.[arrayKey];
  if (Array.isArray(array)) {
    array.forEach((item, index) => {
      if (item?.[nestedKey] !== undefined) {
        target[`${arrayKey}_${nestedKey}_${index}`] = item[nestedKey];
      }
    });
  }

  return target;
};

export const b64ToFile = (b64) => {
  if (!b64?.content) return null;

  const byteString = atob(b64.content);
  const array = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    array[i] = byteString.charCodeAt(i);
  }

  const ext = b64?.ext ? `.${String(b64.ext).toLowerCase()}` : "";
  const name = b64?.name ? String(b64.name) : `archivo${ext}`;

  return new File([array], name, {
    type: b64?.mime || "application/octet-stream",
  });
};

export const toStorePayload = (data, isStoreMode = true) => {
  const payload = { ...data };

  if (!isStoreMode) payload._method = "PUT";

  Object.keys(payload).forEach((key) => {
    if (key.endsWith("_b64")) {
      delete payload[key];
    }
  });

  return payload;
};
