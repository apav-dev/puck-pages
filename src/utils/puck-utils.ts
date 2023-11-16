import { Content, Data } from "@measured/puck";
import classnames from "classnames";
import { fetchLocation } from "./api";

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

type FieldValue = {
  fieldId: string;
  value: string | number;
};

const isUrl = (value: string): boolean => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!urlPattern.test(value);
};

export const getFieldValuesList = (
  obj: Record<string, any>,
  type: "string" | "number" | "url"
): FieldValue[] => {
  const result: FieldValue[] = [];

  const traverse = (currentObject: any, path: string) => {
    if (Array.isArray(currentObject)) {
      currentObject.forEach((item, index) => {
        traverse(item, `${path}[${index}]`);
      });
    } else {
      for (const key in currentObject) {
        if (currentObject.hasOwnProperty(key)) {
          const value = currentObject[key];
          const newPath = path ? `${path}.${key}` : key;

          if (type === "url" && typeof value === "string" && isUrl(value)) {
            result.push({ fieldId: newPath, value: value });
          } else if (
            type === "string" &&
            typeof value === "string" &&
            !isUrl(value)
          ) {
            result.push({ fieldId: newPath, value: value });
          } else if (type === "number" && typeof value === "number") {
            result.push({ fieldId: newPath, value: value });
          } else if (typeof value === "object" && value !== null) {
            traverse(value, newPath);
          }
        }
      }
    }
  };

  traverse(obj, "");
  return result;
};

export const getValueByPath = (obj: any, path: string): string => {
  // Function to split path into parts, considering dot notation and array indices
  const parsePath = (path: string) => {
    const pathParts = path.split(/\.|\[|\]\.?/).filter(Boolean);
    return pathParts;
  };

  const pathParts = parsePath(path);
  let current = obj;

  for (const part of pathParts) {
    if (Array.isArray(current)) {
      const index = parseInt(part, 10);
      if (isNaN(index) || index >= current.length) {
        return ""; // Return an empty string for invalid index
      }
      current = current[index];
    } else if (current[part] === undefined) {
      return ""; // Return an empty string if the path is not found
    } else {
      current = current[part];
    }
  }

  return current !== null ? String(current) : ""; // Convert to string, handling null values
};

type WithPuckProps<Props> = Props & {
  id: string;
};

export const injectDocumentValues = (
  document: Record<string, any>,
  templateData: Data
): Data => {
  const newData: Data = JSON.parse(JSON.stringify(templateData)); // Deep copy of templateData

  const processContent = (content: Content<WithPuckProps<any>>) => {
    for (const key in content) {
      if (content.hasOwnProperty(key)) {
        const component = content[key];
        for (const propKey in component.props) {
          if (component.props.hasOwnProperty(propKey)) {
            const prop = component.props[propKey];
            if (
              prop &&
              typeof prop === "object" &&
              "fieldId" in prop &&
              "value" in prop
            ) {
              prop.value = getValueByPath(document, prop.fieldId);
            }
          }
        }
      }
    }
  };

  processContent(newData.content);

  // if (newData.zones) {
  //   for (const zoneKey in newData.zones) {
  //     if (newData.zones.hasOwnProperty(zoneKey)) {
  //       processContent(newData.zones[zoneKey]);
  //     }
  //   }
  // }

  return newData;
};

export const getEntityFieldsList = async (
  entityId: string,
  fieldType: "string" | "number" | "url"
) => {
  const response = await fetchLocation(entityId);
  const entity = response.response.docs?.[0];
  return getFieldValuesList(entity, fieldType);
};
