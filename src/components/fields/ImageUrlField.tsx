import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/Popover";
import { useQuery } from "@tanstack/react-query";
import { fetchAssets, searchPhotos } from "../../utils/api";
import { UnsplashSearchParams } from "../../types/api";
import { ScrollArea } from "../shadcn/ScrollArea";
import { SearchBar } from "../SearchBar";
import { Link } from "lucide-react";
import { FieldLabel, CustomField } from "@measured/puck";
import { Button } from "../shadcn/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/Tabs";
import { getEntityFieldsList } from "../../utils/puck-utils";

export interface ImageSelectorProps {
  field: CustomField;
  name: string;
  value: any;
  onChange: (value: Props) => void;
  readOnly?: boolean;
  entityId?: string;
}

// using unsplash...could be swapped with a different DAM
export const ImageSelector = ({
  field,
  name,
  onChange,
  value,
  readOnly,
  entityId,
}: ImageSelectorProps) => {
  const [unsplashParams, setUnsplashParams] = useState<UnsplashSearchParams>({
    query: "",
    page: 1,
    perPage: 20,
  });

  const unsplashQuery = useQuery({
    queryKey: ["unsplashParams", unsplashParams],
    retry: false,
    enabled: unsplashParams.query !== "",
    queryFn: () => searchPhotos(unsplashParams),
  });

  const assetsQuery = useQuery({
    queryKey: ["assets"],
    retry: false,
    queryFn: () => fetchAssets(),
  });

  const entityPhotosQuery = useQuery({
    queryKey: ["entityPhotos", entityId],
    retry: false,
    enabled: !!entityId,
    queryFn: () => getEntityFieldsList(entityId, "image url"),
  });

  const handleSearchClick = (value: string) => {
    setUnsplashParams((prev) => ({ ...prev, query: value }));
  };

  return (
    <>
      <FieldLabel label={field.label || name} icon={<Link size={16} />} />
      <Popover>
        <PopoverTrigger>
          <Button variant="outline" className="w-64 truncate">
            <div>{value?.value ?? "Choose an Image"}</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="bg-white w-96"
          sideOffset={8}
          align="end"
          side="left"
        >
          <Tabs defaultValue="search">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Unsplash</TabsTrigger>
              <TabsTrigger value="assets">Shared Assets</TabsTrigger>
              <TabsTrigger value="entity photos">Entity Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <div className="flex flex-col mx-auto gap-y-6">
                <SearchBar onSearch={handleSearchClick} />
                <ScrollArea className="h-[350px] w-full rounded-md border p-4 bg-gray-100">
                  <div className="flex flex-col gap-2 p-2">
                    {!unsplashQuery.isLoading && !unsplashQuery.isSuccess && (
                      <div className="flex justify-center items-center my-auto">
                        Search for Images
                      </div>
                    )}
                    {unsplashQuery.data?.results && (
                      <div className="grid grid-cols-2 gap-2">
                        {unsplashQuery.data?.results.map((result) => (
                          <div
                            className={`flex flex-col gap-2 justify-center ${
                              unsplashQuery.isLoading ? "opacity-50" : ""
                            }`}
                          >
                            <Button
                              className="mx-auto w-[129px] h-[88px] bg-cover relative group"
                              style={{
                                backgroundImage: `url(${result.urls.small})`,
                              }}
                              onClick={() => {
                                onChange({ value: result.urls.regular });
                              }}
                            >
                              <Button
                                className="text-transparent"
                                variant="ghost"
                              >
                                Select
                              </Button>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="assets">
              <div className="flex flex-col mx-auto gap-y-6">
                <ScrollArea className="h-[350px] w-full rounded-md border p-4 bg-gray-100">
                  <div className="flex flex-col gap-2 p-2">
                    {!assetsQuery.isLoading && !assetsQuery.isSuccess && (
                      <div className="flex justify-center items-center my-auto">
                        {/* TODO: update to handle no assets available */}
                        Search for Images
                      </div>
                    )}
                    {assetsQuery.data?.response.assets && (
                      <div className="grid grid-cols-2 gap-2">
                        {assetsQuery.data?.response.assets.map((asset) => (
                          <div
                            className={`flex flex-col gap-2 justify-center ${
                              unsplashQuery.isLoading ? "opacity-50" : ""
                            }`}
                          >
                            <Button
                              className="mx-auto w-[129px] h-[88px] bg-cover relative group"
                              style={{
                                backgroundImage: `url(${asset.value.image.url})`,
                              }}
                              onClick={() => {
                                onChange({ value: asset.value.image.url });
                              }}
                            >
                              <Button
                                className="text-transparent"
                                variant="ghost"
                              >
                                Select
                              </Button>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="entity photos">
              <div className="flex flex-col mx-auto gap-y-6">
                <ScrollArea className="h-[350px] w-full rounded-md border p-4 bg-gray-100">
                  <div className="flex flex-col gap-2 p-2">
                    {!entityPhotosQuery.isLoading &&
                      !entityPhotosQuery.isSuccess && (
                        <div className="flex justify-center items-center my-auto">
                          {/* TODO: update to handle no assets available */}
                          Search for Images
                        </div>
                      )}
                    {entityPhotosQuery.data && (
                      <div className="grid grid-cols-2 gap-2">
                        {entityPhotosQuery.data.map((image) => (
                          <div
                            className={`flex flex-col gap-2 justify-center ${
                              unsplashQuery.isLoading ? "opacity-50" : ""
                            }`}
                          >
                            <Button
                              className="mx-auto w-[129px] h-[88px] bg-cover relative group"
                              style={{
                                backgroundImage: `url(${image.value})`,
                              }}
                              onClick={() => {
                                onChange(image);
                              }}
                            >
                              <Button
                                className="text-transparent"
                                variant="ghost"
                              >
                                Select
                              </Button>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </>
  );
};
