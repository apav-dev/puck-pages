import { ComponentConfig } from "@measured/puck";
import { getEntityFieldsList } from "../../utils/puck-utils";
import { getEntityIdFromUrl } from "../../utils/getEntityIdFromUrl";
import {
  Address as PagesAddressCmpt,
  AddressType,
} from "@yext/pages-components";
import { SelectorField } from "../../components/fields/SelectorField";
import { useDocument } from "../../hooks/useDocument";
import { Locations } from "../../types/autogen";
// import { useTemplateData } from "../../utils/useTemplateData";

export interface AddressProps {
  addressField?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  countryCode?: string;
  sublocality?: string;
  extraDescription?: string;
  localizedRegionName?: string;
  localizedCountryName?: string;
}

export const Address: ComponentConfig<AddressProps> = {
  fields: {
    addressField: {
      label: "Address",
      type: "custom",
      render: ({ field, onChange, value, name }) => {
        const entityId = getEntityIdFromUrl();
        return (
          <SelectorField
            entityId={entityId}
            field={field}
            value={value}
            name={name}
            onChange={onChange}
            label="Address Field"
            entityFieldType="address"
          />
        );
      },
    },
    line1: { label: "Line 1", type: "text" },
    line2: { label: "Line 2", type: "text" },
    line3: { label: "Line 3", type: "text" },
    city: { label: "City", type: "text" },
    region: { label: "Region", type: "text" },
    postalCode: { label: "Postal Code", type: "text" },
    countryCode: { label: "Country Code", type: "text" },
    sublocality: { label: "Sublocality", type: "text" },
    extraDescription: { label: "Extra Description", type: "text" },
    localizedRegionName: { label: "Localized Region Name", type: "text" },
    localizedCountryName: { label: "Localized Country Name", type: "text" },
  },
  defaultProps: {
    line1: "123 Main St",
    city: "New York",
    region: "NY",
    postalCode: "10001",
    countryCode: "US",
  },
  resolveData: async ({ props }, { changed }) => {
    console.log("resolveData", props, changed);
    const data = {
      props: { ...props },
      readOnly: {},
    };
    if (props.addressField) {
      const fields = await getEntityFieldsList("address");
      const field = fields.find(
        (field) => field.fieldId === props.addressField
      );
      const value = field?.value as AddressType;
      if (field) {
        data.props = {
          ...value,
          addressField: props.addressField,
          id: props.id,
        };
        data.readOnly = {
          line1: true,
          line2: true,
          line3: true,
          city: true,
          region: true,
          postalCode: true,
          countryCode: true,
          sublocality: true,
          extraDescription: true,
          localizedRegionName: true,
          localizedCountryName: true,
        };
      }
    }

    return data;
  },
  render: ({
    addressField,
    line1,
    line2,
    line3,
    city,
    region,
    postalCode,
    countryCode,
    sublocality,
    extraDescription,
    localizedRegionName,
    localizedCountryName,
  }) => {
    const document = useDocument<Locations>();

    return (
      <PagesAddressCmpt
        address={
          addressField && document && document[addressField]
            ? document[addressField]
            : {
                line1,
                line2,
                line3,
                city,
                region,
                postalCode,
                countryCode,
                sublocality,
                extraDescription,
                localizedRegionName,
                localizedCountryName,
              }
        }
      />
    );
  },
};
