import { Content, Data } from "@measured/puck";
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

type FieldValue = {
  fieldId: string;
  value: string | number;
};

export const getFieldValues = (
  obj: Record<string, any>,
  type: "string" | "number"
): FieldValue[] => {
  const result: FieldValue[] = [];

  const traverse = (currentObject: Record<string, any>, path: string) => {
    for (const key in currentObject) {
      if (currentObject.hasOwnProperty(key)) {
        const value = currentObject[key];
        const newPath = path ? `${path}.${key}` : key;

        if (typeof value === type) {
          result.push({ fieldId: newPath, value: value });
        } else if (typeof value === "object" && value !== null) {
          traverse(value, newPath);
        }
      }
    }
  };

  traverse(obj, "");
  return result;
};

export const getValueByPath = (obj: any, path: string): string => {
  const pathParts = path.split(".");
  let current = obj;

  for (const part of pathParts) {
    if (current[part] === undefined) {
      return ""; // Return an empty string if the path is not found
    }
    current = current[part];
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
