import { ComponentConfig } from "@measured/puck";
import { ImageSelector } from "../../components/fields/ImageUrlField";
import { getEntityIdFromUrl } from "../../utils/getEntityIdFromUrl";
import { ImagesField } from "../../components/fields/ImagesField";

export type GalleryProps = {
  images: { fieldId?: string; value: string }[];
};

const defaultImages = [
  {
    value:
      "https://tailwindui.com/img/ecommerce-images/home-page-03-featured-category.jpg",
  },
  {
    value:
      "https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg",
  },
  {
    value:
      "https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg",
  },
];

export const Gallery: ComponentConfig<GalleryProps> = {
  fields: {
    images: {
      label: "Images",
      type: "custom",
      render: ({ field, onChange, value, name }) => {
        const entityId = getEntityIdFromUrl();
        return (
          <ImagesField
            entityId={entityId}
            field={field}
            value={value ?? defaultImages}
            name={name}
            onChange={onChange}
          />
        );
      },
    },
  },
  defaultProps: {
    images: defaultImages,
  },
  render: ({ images }) => {
    return (
      <section aria-labelledby="category-heading" className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
            <div className="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-h-1 sm:aspect-w-1 sm:row-span-2">
              <img
                src={images[0]?.value}
                alt="Two models wearing women's black cotton crewneck tee and off-white cotton crewneck tee."
                className="object-cover object-center group-hover:opacity-75"
              />
              <div
                aria-hidden="true"
                className="bg-gradient-to-b from-transparent to-black opacity-50"
              />
              <div className="flex items-end p-6">
                <div>
                  <h3 className="font-semibold text-white">
                    <a href="#">
                      <span className="absolute inset-0" />
                      New Arrivals
                    </a>
                  </h3>
                  <p aria-hidden="true" className="mt-1 text-sm text-white">
                    Shop now
                  </p>
                </div>
              </div>
            </div>
            <div className="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-none sm:relative sm:h-full">
              <img
                src={images[1]?.value}
                alt="Wooden shelf with gray and olive drab green baseball caps, next to wooden clothes hanger with sweaters."
                className="object-cover object-center group-hover:opacity-75 sm:absolute sm:inset-0 sm:h-full sm:w-full"
              />
              <div
                aria-hidden="true"
                className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
              />
              <div className="flex items-end p-6 sm:absolute sm:inset-0">
                <div>
                  <h3 className="font-semibold text-white">
                    <a href="#">
                      <span className="absolute inset-0" />
                      Accessories
                    </a>
                  </h3>
                  <p aria-hidden="true" className="mt-1 text-sm text-white">
                    Shop now
                  </p>
                </div>
              </div>
            </div>
            <div className="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-none sm:relative sm:h-full">
              <img
                src={images[2]?.value}
                alt="Walnut desk organizer set with white modular trays, next to porcelain mug on wooden desk."
                className="object-cover object-center group-hover:opacity-75 sm:absolute sm:inset-0 sm:h-full sm:w-full"
              />
              <div
                aria-hidden="true"
                className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
              />
              <div className="flex items-end p-6 sm:absolute sm:inset-0">
                <div>
                  <h3 className="font-semibold text-white">
                    <a href="#">
                      <span className="absolute inset-0" />
                      Workspace
                    </a>
                  </h3>
                  <p aria-hidden="true" className="mt-1 text-sm text-white">
                    Shop now
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:hidden">
            <a
              href="#"
              className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Browse all categories
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </section>
    );
  },
};
