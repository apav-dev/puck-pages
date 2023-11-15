import { EntityContent, YextResponse } from "./types/api";

export const formatDate = (date?: string) => {
  if (!date) {
    return "";
  }

  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const fetchEntity = async (
  entityId?: string
): Promise<YextResponse<EntityContent>> => {
  const response = await fetch(
    `https://cdn.yextapis.com/v2/accounts/me/content/entities?api_key=${YEXT_PUBLIC_CONTENT_API_KEY}&v=20231112&id=${entityId}`
  );
  const body = await response.json();
  return body;
};

import classnames from "classnames";

export const getGlobalClassName = (rootClass, options) => {
  if (typeof options === "string") {
    return `${rootClass}-${options}`;
  } else {
    const mappedOptions = {};
    for (let option in options) {
      mappedOptions[`${rootClass}--${option}`] = options[option];
    }

    return classnames({
      [rootClass]: true,
      ...mappedOptions,
    });
  }
};

export const getClassNameFactory =
  (rootClass, styles, { baseClass = "" } = {}) =>
  (options = {}) => {
    let descendant: any = false;
    let modifiers: any = false;

    if (typeof options === "string") {
      descendant = options;
    } else if (typeof options === "object") {
      modifiers = options;
    }

    if (descendant) {
      return baseClass + styles[`${rootClass}-${descendant}`] || "";
    } else if (modifiers) {
      const prefixedModifiers = {};

      for (let modifier in modifiers) {
        prefixedModifiers[styles[`${rootClass}--${modifier}`]] =
          modifiers[modifier];
      }

      const c = styles[rootClass];

      return (
        baseClass +
        classnames({
          [c]: !!c, // only apply the class if it exists
          ...prefixedModifiers,
        })
      );
    } else {
      return baseClass + styles[rootClass] || "";
    }
  };
