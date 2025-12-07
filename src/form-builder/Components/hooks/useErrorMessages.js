import { useEffect } from "react";

const ERROR_CONTAINER_CLASS = "b-blocks-input-field-error-container";
const ERROR_MESSAGE_SELECTOR = ".b-blocks-input-field-error-message";
const FIELD_CONTAINER_PREFIX = ".b-blocks-input-field-validation-";

const LOGIN_ERROR_MAP = {
  invalid_email: {
    name: "email",
    message: "Incorrect email",
  },
  invalid_username: {
    name: "username",
    message: "Incorrect username",
  },
  incorrect_password: {
    name: "password",
    message: "Incorrect password",
  },
};


const getFieldElements = (form, name) => {
  if (!form) return { container: null, messageEl: null };

  const container = form.querySelector(
    `${FIELD_CONTAINER_PREFIX}${name}`
  );

  const messageEl = container?.querySelector(
    ERROR_MESSAGE_SELECTOR
  );

  return { container, messageEl };
};

const showFieldError = (form, name, message) => {
  const { container, messageEl } = getFieldElements(form, name);

  if (!container || !messageEl) return;

  messageEl.style.display = "unset";
  messageEl.textContent = message;
  container.classList.add(ERROR_CONTAINER_CLASS);
};

const clearFieldError = (form, name) => {
  const { container, messageEl } = getFieldElements(form, name);
  if (!container || !messageEl) return;

  messageEl.style.display = "none";
  container.classList.remove(ERROR_CONTAINER_CLASS);
};


const clearFieldsErrors = (form, names) => {
  names.forEach((name) => clearFieldError(form, name));
};

const getFormFieldNames = (form) => {
  if (!form) return [];
  const formData = new FormData(form);
  return Array.from(formData.keys());
};

export const useErrorMessages = (error, isError, formRef, formType) => {
  useEffect(() => {
    const form = formRef?.current;
    if (!form) return;

    if (!error) {
      return;
    }

    if (formType === "register") {
      const names = getFormFieldNames(form);
      const errorMessage = error?.message || "";

      names.forEach((name) => {
        const match =
          typeof errorMessage === "string" &&
          errorMessage.toLowerCase().includes(name.toLowerCase());

        if (match) {
          showFieldError(form, name, errorMessage);
        } else {
          clearFieldError(form, name);
        }
      });
    }
    if (formType === "login") {
      const errorCode = error?.errorCode;
      clearFieldsErrors(form, ["email", "username", "password"]);

      const config = LOGIN_ERROR_MAP[errorCode];

      if (config) {
        showFieldError(form, config.name, config.message);
      }
    }
  }, [error, isError, formRef, formType]);
};
