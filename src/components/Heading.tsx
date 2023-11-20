import { ReactNode } from "react";

export type HeadingProps = {
  children: ReactNode;
  rank?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "xxxxl" | "xxxl" | "xxl" | "xl" | "l" | "m" | "s" | "xs";
};

export const Heading = ({ children, rank, size = "m" }: HeadingProps) => {
  const Tag: any = rank ? `h${rank}` : "span";
  let fontSizeClass = "";

  switch (size) {
    case "xxxxl":
      fontSizeClass = "text-4xl"; // Adjust this value to match your design
      break;
    case "xxxl":
      fontSizeClass = "text-3xl";
      break;
    case "xxl":
      fontSizeClass = "text-2xl";
      break;
    case "xl":
      fontSizeClass = "text-xl";
      break;
    case "l":
      fontSizeClass = "text-lg";
      break;
    case "m":
      fontSizeClass = "text-base";
      break;
    case "s":
      fontSizeClass = "text-sm";
      break;
    case "xs":
      fontSizeClass = "text-xs";
      break;
    default:
      fontSizeClass = "text-base";
  }

  return (
    <Tag className={`${fontSizeClass} block text-black font-bold m-0`}>
      {children}
    </Tag>
  );
};
