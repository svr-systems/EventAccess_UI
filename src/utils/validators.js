export const getRules = () => {
  const isNil = (v) => v === null || v === undefined;
  const isBlank = (v) => isNil(v) || String(v).trim() === "";

  const required =
    (msg = "Campo requerido") =>
    (value) =>
      !isBlank(value) || msg;

  const requiredNotNull =
    (msg = "Campo requerido") =>
    (value) =>
      !isNil(value) || msg;

  const maxLength =
    (max, msg = `Máximo ${max} caracteres`) =>
    (value) =>
      isBlank(value) || String(value).length <= max || msg;

  const minLength =
    (min, msg = `Mínimo ${min} caracteres`) =>
    (value) =>
      isBlank(value) || String(value).length >= min || msg;

  const regexMatch =
    (regex, msg = "Formato inválido") =>
    (value) =>
      isBlank(value) || regex.test(String(value)) || msg;

  const onlyDigits =
    (msg = "Solo se permiten números") =>
    (value) =>
      isBlank(value) || /^\d+$/.test(String(value)) || msg;

  const fileMaxSize = (maxBytes, label) => (value) =>
    !value || value.size <= maxBytes || `Máximo ${label}`;

  const fileRequiredSize = (maxBytes, label) => (value) =>
    (value && value.size <= maxBytes) || `Máximo ${label}`;

  const CURP_STATES =
    "(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)";
  const CURP_PREFIX = "[A-ZÑ][AEIOU][A-ZÑ]{2}";
  const CURP_DATE = "\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])";
  const CURP_SEX = "[HM]";
  const CURP_CONS = "[B-DF-HJ-NP-TV-ZÑ]{3}";
  const CURP_HOMO = "[0-9A-Z]";
  const CURP_DV = "\\d";
  const CURP_REGEX = new RegExp(
    `^${CURP_PREFIX}${CURP_DATE}${CURP_SEX}${CURP_STATES}${CURP_CONS}${CURP_HOMO}${CURP_DV}$`,
  );

  const curp =
    (msg = "CURP inválida") =>
    (value) =>
      isBlank(value) ||
      CURP_REGEX.test(String(value).trim().toUpperCase()) ||
      msg;

  return {
    required: [required()],
    requiredNotNull: [requiredNotNull()],

    textRequired: [required(), minLength(2, "Mínimo 2 caracteres")],
    textOptional: [minLength(2, "Mínimo 2 caracteres")],

    numberRequired: [required(), onlyDigits()],
    numberOptional: [onlyDigits()],

    emailRequired: [
      required(),
      maxLength(65, "Máximo 65 caracteres"),
      regexMatch(/.+@.+\..+/, "Formato inválido"),
    ],
    emailOptional: [
      maxLength(65, "Máximo 65 caracteres"),
      regexMatch(/.+@.+\..+/, "Formato inválido"),
    ],

    passwordRequired: [
      required(),
      minLength(8, "Mínimo 8 caracteres"),
      maxLength(20, "Máximo 20 caracteres"),
      regexMatch(/(?=.*[A-Z])/, "Al menos una mayúscula"),
      regexMatch(/(?=.*[a-z])/, "Al menos una minúscula"),
      regexMatch(/(?=.*[0-9])/, "Al menos un número"),
      regexMatch(/(?=.*[!@$%*])/, "Al menos un carácter especial (! @ $ % *)"),
    ],

    fileRequired: [required(), fileRequiredSize(1048576, "1MB")],
    fileOptional: [fileMaxSize(1048576, "1MB")],

    imageRequired: [required(), fileRequiredSize(2097152, "2MB")],
    imageOptional: [fileMaxSize(2097152, "2MB")],

    fiscalCodeRequired: [
      required(),
      maxLength(13, "Máximo 13 caracteres"),
      regexMatch(/^[A-Za-zñÑ&]{3,4}\d{6}\w{3}$/, "Formato inválido"),
    ],
    fiscalCodeOptional: [
      maxLength(13, "Máximo 13 caracteres"),
      regexMatch(/^[A-Za-zñÑ&]{3,4}\d{6}\w{3}$/, "Formato inválido"),
    ],

    zipRequired: [required(), regexMatch(/^\d{5}$/, "Ingresar 5 dígitos")],
    zipOptional: [regexMatch(/^\d{5}$/, "Ingresar 5 dígitos")],

    phoneRequired: [required(), regexMatch(/^\d{10}$/, "Ingresar 10 dígitos")],
    phoneOptional: [regexMatch(/^\d{10}$/, "Ingresar 10 dígitos")],

    curpRequired: [required(), curp()],
    curpOptional: [curp()],

    cycleRequired: [
      required(),
      regexMatch(/^\d{4}-\d+$/, "Formato inválido, usar AAAA-N"),
    ],
    cycleOptional: [regexMatch(/^\d{4}-\d+$/, "Formato inválido, usar AAAA-N")],
  };
};
