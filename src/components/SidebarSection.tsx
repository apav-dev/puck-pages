import { ReactNode } from "react";
// import getClassNameFactory from "../../lib/get-class-name-factory";
// import { Heading } from "../Heading";
// import { ChevronRight } from "react-feather";
// import { useBreadcrumbs } from "../../lib/use-breadcrumbs";
// import { useAppContext } from "../Puck/context";
// import { ClipLoader } from "react-spinners";
import { Heading } from "./Heading";

export const SidebarSection = ({
  children,
  title,
  background,
  showBreadcrumbs,
  noPadding,
  isLoading,
}: {
  children: ReactNode;
  title: ReactNode;
  background?: string;
  showBreadcrumbs?: boolean;
  noPadding?: boolean;
  isLoading?: boolean | null;
}) => {
  // const { setUi } = useAppContext();
  // const breadcrumbs = useBreadcrumbs(1);

  return (
    <div
      className={`flex flex-col relative ${
        noPadding ? "" : "p-4"
      } ${background}`}
      style={{ color: "black" }}
    >
      <div className="bg-white p-4 border-b border-gray-300 overflow-x-auto">
        <div className="flex items-center gap-1">
          {/* {showBreadcrumbs
            ? breadcrumbs.map((breadcrumb, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div
                    className="text-blue-300 hover:text-blue-400 cursor-pointer underline"
                    onClick={() => setUi({ itemSelector: breadcrumb.selector })}
                  >
                    {breadcrumb.label}
                  </div>
                  <ChevronRight size={16} />
                </div>
              ))
            : null} */}
          <div className="pr-4">
            <Heading rank={2} size="m">
              {title}
            </Heading>
          </div>
        </div>
      </div>
      <div className={`border-b border-gray-300 ${noPadding ? "p-0" : "p-4"}`}>
        {children}
      </div>
      {isLoading && (
        <div className="absolute top-0 w-full h-full bg-white flex justify-center items-center opacity-80 z-10">
          {/* <ClipLoader /> */}
        </div>
      )}
    </div>
  );
};
