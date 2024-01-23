import { useState } from "react";
import { Link } from "lucide-react";
import { FieldLabel, CustomField } from "@measured/puck";
import { Button } from "../shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/Dialog";
import { ImageSelector } from "../ImageSelector";
import { ComplexImageType, ImageType } from "@yext/pages-components";
import { getImageUrl } from "../../utils/type-utils";

export interface ImageFieldProps {
  name: string;
  value:
    | { imageUrl: string }
    | { fieldId: string; value: ComplexImageType | ImageType };
  onChange: (value: Props) => void;
  field: CustomField;
  entityId?: string;
}

export const ImageField = ({
  name,
  field,
  value,
  entityId,
  onChange,
}: ImageFieldProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [replacingImage, setReplacingImage] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState(value);

  const handleCancel = () => {
    setDialogOpen(false);
    setReplacingImage(false);
  };

  const handleReplaceImage = (value: {
    fieldId?: string;
    imageUrl: string;
  }) => {
    setSelectedImage(value);
    setReplacingImage(false);
  };

  const onSubmit = () => {
    setDialogOpen(false);
    onChange(selectedImage);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(isOpen) => setDialogOpen(isOpen)}>
      <FieldLabel
        label={field.label || name}
        // TODO: replace with images icon
        icon={<Link size={16} />}
      />
      <div className="relative group">
        {value ? (
          <img
            src={getImageUrl(selectedImage)}
            alt={`Image`}
            className="w-full h-auto"
          />
        ) : (
          <DialogTrigger className="" onClick={() => setDialogOpen(true)}>
            Select Image
          </DialogTrigger>
        )}
        {value && (
          <>
            <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-50" />
            <DialogTrigger
              className="absolute top-0 bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => setDialogOpen(true)}
            >
              <Button variant="outline">Modify Images</Button>
            </DialogTrigger>
          </>
        )}
      </div>
      <DialogContent className="max-w-2xl p-0 ">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle>Images</DialogTitle>
          <DialogDescription>Choose an image.</DialogDescription>
        </DialogHeader>
        {/* <div className="relative"> */}
        <div className="h-[400px] border-y grid relative left-auto right-auto">
          {replacingImage ? (
            <ImageSelector onChange={handleReplaceImage} entityId={entityId} />
          ) : (
            <div className="relative group">
              <div className="bg-gray-100 ">
                {/* TODO: fade image into view */}
                <img
                  alt="Placeholder image"
                  className={`object-cover aspect-square mx-auto`}
                  height="400"
                  src={getImageUrl(selectedImage)}
                  width="400"
                />
              </div>
              <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-50" />
              <div className="absolute top-0 bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={() => setReplacingImage(true)}
                >
                  Replace Image
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end items-center p-2 gap-4">
          <Button
            type="submit"
            className="p-4"
            variant="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" className="p-4" onClick={() => onSubmit()}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
