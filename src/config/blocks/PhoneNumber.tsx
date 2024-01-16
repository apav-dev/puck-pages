import { ComponentConfig } from "@measured/puck";
import { FaPhone } from "react-icons/fa";
import { getEntityFieldsList } from "../../utils/puck-utils";

export interface PhoneNumberProps {
  label: string;
  phoneNumberField?: { fieldId: string; value: string };
  phoneNumber: string;
}

export const PhoneNumber: ComponentConfig<PhoneNumberProps> = {
  fields: {
    label: {
      label: "Label",
      type: "text",
    },
    phoneNumberField: {
      label: "Phone Numbers",
      type: "external",
      getItemSummary: (item, i) => item?.fieldId || `Phone Number #${i}`,
      fetchList: async () => {
        const fields = await getEntityFieldsList("phone number");
        return fields;
      },
    },
    phoneNumber: {
      label: "Phone Number",
      type: "text",
    },
  },
  defaultProps: {
    label: "Phone",
    phoneNumber: "555-555-5555",
  },
  resolveData: async ({ props }, { changed }) => {
    const data = {
      props: { ...props },
      readOnly: {
        phoneNumber: false,
      },
    };

    if (changed.phoneNumberField) {
      const fields = await getEntityFieldsList("phone number");
      const field = fields.find(
        (field) => field.fieldId === props.phoneNumberField?.fieldId
      );
      if (field) {
        data.props = { ...data.props, phoneNumber: field.value };
        data.readOnly = { ...data.readOnly, phoneNumber: true };
      }
    }

    return data;
  },
  render: ({ label, phoneNumberField, phoneNumber: number }) => {
    return (
      <div className="flex items-center mt-4">
        <FaPhone className="text-blue-500 mr-2" />
        <span className="mr-2 font-bold">{label}</span>
        <span>{phoneNumberField ? phoneNumberField.value : number}</span>
      </div>
    );
  },
};
