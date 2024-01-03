import { Content, Data } from "@measured/puck";
import classnames from "classnames";
import { fetchEntityDocument } from "./api";
import { EntityFieldType } from "../types/yext";
import {
  AddressType,
  DayType,
  HolidayType,
  HoursType,
  IntervalType,
  WeekType,
} from "@yext/pages-components";

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
  value: string | number | AddressType | HoursType;
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

const isImageUrl = (value: string): boolean => {
  const imageUrlRegex =
    /(https?:\/\/a.mktgcdn.com\/p(?<env>-sandbox|-qa|-dev)?\/)(?<uuid>.+)\/(.*)/;
  return imageUrlRegex.test(value);
};

const isPhoneNumber = (value: string): boolean => {
  const phoneNumberRegex = /^\+?[0-9]{10,14}$/;
  return phoneNumberRegex.test(value);
};

const isEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isAddressType = (value: any): boolean => {
  const requiredFields = ["line1", "city", "postalCode", "countryCode"];
  const optionalFields = [
    "line2",
    "line3",
    "region",
    "sublocality",
    "extraDescription",
    "localizedRegionName",
    "localizedCountryName",
  ];

  if (typeof value !== "object" || value === null) return false;

  let hasAllRequiredFields = requiredFields.every(
    (field) => field in value && typeof value[field] === "string"
  );
  let hasValidOptionalFields = optionalFields.every(
    (field) =>
      !(field in value) ||
      typeof value[field] === "string" ||
      value[field] === undefined
  );

  return hasAllRequiredFields && hasValidOptionalFields;
};

const isIntervalType = (value: any): value is IntervalType => {
  return (
    value && typeof value.start === "string" && typeof value.end === "string"
  );
};

const isDayType = (value: any): value is DayType => {
  return (
    value &&
    // typeof value.isClosed === "boolean" &&
    Array.isArray(value.openIntervals) &&
    value.openIntervals.every(isIntervalType)
  );
};

const isHolidayType = (value: any): value is HolidayType => {
  return (
    value &&
    typeof value.date === "string" &&
    (value.isClosed === undefined || typeof value.isClosed === "boolean") &&
    Array.isArray(value.openIntervals) &&
    value.openIntervals.every(isIntervalType) &&
    typeof value.isRegularHours === "boolean"
  );
};

const isWeekType = (value: any): value is WeekType => {
  const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  return weekDays.every((day) => isDayType(value[day]));
};

const isHoursType = (value: any): value is HoursType => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!isWeekType(value)) {
    return false;
  }

  // Check 'holidayHours' only if it exists
  // if ("holidayHours" in value) {
  //   if (
  //     !Array.isArray(value.holidayHours) ||
  //     !value.holidayHours.every(isHolidayType)
  //   ) {
  //     return false;
  //   }
  // }

  // Check 'reopenDate' only if it exists
  if ("reopenDate" in value && typeof value.reopenDate !== "string") {
    return false;
  }

  return true;
};

export const getFieldValuesList = (
  obj: Record<string, any>,
  type: EntityFieldType
): FieldValue[] => {
  const result: FieldValue[] = [];

  const processValue = (value: any, path: string) => {
    if (type === "hours" && isHoursType(value)) {
      result.push({ fieldId: path, value }); // Convert the hours object to a string
    } else if (type === "address" && isAddressType(value)) {
      console.log("address", value);
      result.push({ fieldId: path, value });
    } else if (type === "url" && typeof value === "string" && isUrl(value)) {
      result.push({ fieldId: path, value: value });
    } else if (
      type === "image url" &&
      typeof value === "string" &&
      isUrl(value) &&
      isImageUrl(value)
    ) {
      result.push({ fieldId: path, value: value });
    } else if (
      type === "string" &&
      typeof value === "string" &&
      !isUrl(value) &&
      !isEmail(value)
    ) {
      result.push({ fieldId: path, value: value });
    } else if (type === "number" && typeof value === "number") {
      result.push({ fieldId: path, value: value });
    } else if (
      type === "phone number" &&
      typeof value === "string" &&
      isPhoneNumber(value)
    ) {
      result.push({ fieldId: path, value: value });
    } else if (
      type === "email" &&
      typeof value === "string" &&
      isEmail(value)
    ) {
      result.push({ fieldId: path, value: value });
    }
  };

  const traverse = (currentObject: any, path: string) => {
    // Check and process 'hours' type at the current level
    if (type === "hours" && isHoursType(currentObject)) {
      processValue(currentObject, path);
    }
    // Check and process 'address' type at the current level
    else if (type === "address" && isAddressType(currentObject)) {
      processValue(currentObject, path);
    }

    // Continue traversal for objects and arrays
    if (Array.isArray(currentObject)) {
      currentObject.forEach((item, index) => {
        const itemPath = `${path}[${index}]`;
        if (typeof item === "object" && item !== null) {
          traverse(item, itemPath);
        } else {
          processValue(item, itemPath);
        }
      });
    } else if (typeof currentObject === "object" && currentObject !== null) {
      for (const key in currentObject) {
        if (currentObject.hasOwnProperty(key)) {
          const value = currentObject[key];
          const newPath = path ? `${path}.${key}` : key;
          if (typeof value === "object" && value !== null) {
            traverse(value, newPath);
          } else {
            processValue(value, newPath);
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

  const processProp = (prop: any) => {
    if (Array.isArray(prop)) {
      prop.forEach((item) => processProp(item));
    } else if (prop && typeof prop === "object") {
      if ("fieldId" in prop && "value" in prop) {
        prop.value = getValueByPath(document, prop.fieldId);
      } else {
        for (const key in prop) {
          if (prop.hasOwnProperty(key)) {
            processProp(prop[key]);
          }
        }
      }
    }
  };

  const processContent = (content: Content<WithPuckProps<any>>) => {
    for (const key in content) {
      if (content.hasOwnProperty(key)) {
        const component = content[key];
        for (const propKey in component.props) {
          if (component.props.hasOwnProperty(propKey)) {
            processProp(component.props[propKey]);
          }
        }
      }
    }
  };

  processContent(newData.content);

  // Process zones if they exist
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
  fieldType: EntityFieldType
) => {
  if (entityId === "") return [];

  const response = await fetchEntityDocument("location", entityId);

  const entity = response.response.document;
  return getFieldValuesList(entity, fieldType);
};
