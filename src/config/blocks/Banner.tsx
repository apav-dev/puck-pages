import { useState } from "react";
import { Image, ImageType } from "@yext/pages-components";
import { FaTimes } from "react-icons/fa";
import { ComponentConfig } from "@measured/puck";

export interface BannerProps {
  // image?: string;
  text: string;
  hasCloseBtn?: boolean;
}

// TODO: Add Image field
export const Banner: ComponentConfig<BannerProps> = {
  fields: {
    // image: { type: "image" },
    text: { type: "text" },
    hasCloseBtn: {
      type: "radio",
      label: "Show close button?",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  },
  defaultProps: {
    // image: "",
    text: "Banner Text",
    hasCloseBtn: false,
  },
  render: ({
    // image,
    text,
    hasCloseBtn,
  }) => {
    const [showBanner, setShowBanner] = useState(true);

    if (!showBanner) {
      return <></>;
    }

    return (
      <div className="Banner bg-primary text-white py-4">
        <div className="container flex items-center">
          {/* {image && (
            <div className="flex mr-4 w-4">
              {typeof image === "string" ? (
                <img src={image} alt="Logo" className="object-fill" />
              ) : (
                <Image image={image} layout="fill" />
              )}
            </div>
          )} */}
          <div className="flex flex-grow mr-4">{text}</div>

          {hasCloseBtn && (
            <button onClick={() => setShowBanner(false)}>
              <FaTimes className="w-4 h-4" />
              <span className="sr-only">Hide banner</span>
            </button>
          )}
        </div>
      </div>
    );
  },
};
