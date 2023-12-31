import { ComponentConfig } from "@measured/puck";
import { Link } from "@yext/pages-components";
import { FaEnvelope } from "react-icons/fa";
import { getEntityFieldsList } from "../../utils/puck-utils";
import { getEntityIdFromUrl } from "../../utils/getEntityIdFromUrl";

export interface EmailProps {
  emailField?: { fieldId: string; value: string };
  email?: string;
}

// TODO: Figure out how to build compound Business info component from smaller components
export const Email: ComponentConfig<EmailProps> = {
  fields: {
    emailField: {
      label: "Email Field",
      type: "external",
      getItemSummary: (item) => item?.fieldId || "Select an Email Field",
      fetchList: async () => {
        const entityId = getEntityIdFromUrl();
        const fields = await getEntityFieldsList(entityId, "email");
        return fields;
      },
    },
    email: { label: "Email", type: "text" },
  },
  defaultProps: {
    email: "your-email@yext.com",
  },
  resolveData: async ({ props }, { changed }) => {
    const data = {
      props: { ...props },
      readOnly: {
        email: false,
      },
    };

    const entityId = getEntityIdFromUrl();

    if (changed.emailField) {
      const fields = await getEntityFieldsList(entityId, "email");
      const emailField = fields.find(
        (field) => field.fieldId === props.emailField?.fieldId
      );
      if (emailField) {
        data.props.email = emailField.value;
        data.readOnly = { ...data.readOnly, email: true };
      }
    }

    return data;
  },
  render: ({ emailField, email }) => {
    return (
      <div className="flex items-center mt-4">
        <FaEnvelope className="text-blue-500 mr-2" />
        <Link
          className="Link--primary Link--underline font-bold"
          cta={{
            link: emailField ? emailField.value : email,
            linkType: "Email",
          }}
        />
      </div>
    );
  },
};
