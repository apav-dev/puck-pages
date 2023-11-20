import { AppState } from "@measured/puck";
import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../components/Popover";
import { useQuery } from "@tanstack/react-query";
import { searchPhotos } from "../utils/api";
import { UnsplashSearchParams } from "../types/api";
import { ScrollArea } from "../components/ScrollArea";
import { SearchBar } from "../components/SearchBar";
import { Copy } from "lucide-react";
import { SidebarSection } from "../components/SidebarSection";

// using unsplash...could be swapped with a different DAM
export const ImageSelector = () => {
  const [unsplashParams, setUnsplashParams] = useState<UnsplashSearchParams>({
    query: "",
    page: 1,
    perPage: 20,
  });

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["unsplashParams", unsplashParams],
    retry: false,
    enabled: unsplashParams.query !== "",
    queryFn: () => searchPhotos(unsplashParams),
  });

  const handleSearchClick = (value: string) => {
    setUnsplashParams((prev) => ({ ...prev, query: value }));
  };

  return (
    <SidebarSection title="Image Picker" noPadding>
      <Popover>
        <PopoverTrigger className="p-4">Open</PopoverTrigger>
        <PopoverContent
          className="bg-white w-96"
          sideOffset={8}
          align="end"
          side="left"
        >
          <div className="flex flex-col mx-auto gap-y-6">
            <SearchBar onSearch={handleSearchClick} />
            <ScrollArea className="h-[350px] w-full rounded-md border p-4 bg-gray-100">
              <div className="flex flex-col gap-2 p-2">
                {!isLoading && !isSuccess && (
                  <div className="flex justify-center items-center my-auto">
                    Search for Images
                  </div>
                )}
                {data?.results && (
                  <div className="grid grid-cols-2 gap-2">
                    {data?.results.map((result) => (
                      <div
                        className={`flex flex-col gap-2 justify-center ${
                          isLoading ? "opacity-50" : ""
                        }`}
                      >
                        <div
                          className="mx-auto w-[129px] h-[88px] bg-cover relative group"
                          style={{
                            backgroundImage: `url(${result.urls.small})`,
                          }}
                          onClick={() =>
                            navigator.clipboard.writeText(result.urls.regular)
                          }
                        >
                          <div className="hidden absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 group-hover:flex justify-center items-center">
                            <Copy className="text-white" size={24} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </SidebarSection>
  );
};

const Plugin = ({
  children,
  state,
  dispatch,
}: {
  children: ReactNode;
  state: AppState;
  dispatch: (action: PuckAction) => void;
}) => {
  return (
    <div>
      {children}
      <ImageSelector />
    </div>
  );
};

const ImagePlugin = {
  renderRootFields: Plugin,
};

export default ImagePlugin;
