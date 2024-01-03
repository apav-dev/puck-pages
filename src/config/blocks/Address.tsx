import { ComponentConfig } from "@measured/puck";
import { getEntityFieldsList } from "../../utils/puck-utils";
import { getEntityIdFromUrl } from "../../utils/getEntityIdFromUrl";
import {
  Address as PagesAddressCmpt,
  AddressType,
} from "@yext/pages-components";

export interface AddressProps {
  addressField?: { fieldId: string; value: AddressType };
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
    // TODO: Replace with DropdownField
    addressField: {
      label: "Address",
      type: "external",
      getItemSummary: (item, i) => item?.fieldId || `Address #${i}`,
      fetchList: async () => {
        const entityId = getEntityIdFromUrl();
        const fields = await getEntityFieldsList(entityId, "address");
        return fields;
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
    const data = {
      props: { ...props },
    };

    const entityId = getEntityIdFromUrl();

    if (changed.addressField) {
      const fields = await getEntityFieldsList(entityId, "address");
      const field = fields.find(
        (field) => field.fieldId === props.addressField?.fieldId
      );
      // if (field) {
      //   data.props = { ...data.props, addressField: field.value };
      // }
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
    return (
      <PagesAddressCmpt
        address={
          addressField
            ? addressField.value
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
