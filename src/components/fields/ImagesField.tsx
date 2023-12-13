import { useCallback, useState } from "react";
import { Link } from "lucide-react";
import { FieldLabel, CustomField } from "@measured/puck";
import { Button } from "../Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Dialog";
import { ImageSelector } from "../ImageSelector";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../Form";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

export interface ImagesFieldProps {
  name: string;
  value: { fieldId?: string; value: string }[];
  onChange: (value: Props) => void;
  field: CustomField;
  entityId?: string;
}

const imagesSchema = z.array(
  z.object({
    fieldId: z.string().optional(),
    value: z.string(),
  })
);

// Function to help with reordering the result
// TODO: type item properly
const reorder = (
  list: Item[],
  startIndex: number,
  endIndex: number
): Item[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const ImagesField = ({
  name,
  field,
  value,
  entityId,
}: ImagesFieldProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [replacingImage, setReplacingImage] = useState<boolean>(false);
  const [images, setImages] =
    useState<{ fieldId?: string; value: string }[]>(value);

  const form = useForm<z.infer<typeof imagesSchema>>({
    resolver: zodResolver(imagesSchema),
    defaultValues: value,
  });

  const handleReplaceImage = (image: { fieldId?: string; value: string }) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages[selectedImageIdx] = image;
      return newImages;
    });
    setReplacingImage(false);
  };

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const newImages = reorder(
        images,
        result.source.index,
        result.destination.index
      );

      setImages(newImages);
    },
    [images]
  );

  function onSubmit(values: z.infer<typeof imagesSchema>) {
    setDialogOpen(false);
    console.log(values);
  }

  return (
    <Dialog open={dialogOpen}>
      <FieldLabel
        label={field.label || name}
        // TODO: replace with images icon
        icon={<Link size={16} />}
      />
      <div className="grid grid-cols-2 gap-2 relative p-4 border group">
        {value?.length ? (
          value.map((image, index) => (
            <img
              key={index}
              src={image.value}
              alt={`Image ${index + 1}`}
              className="w-full h-auto"
            />
          ))
        ) : (
          <DialogTrigger onClick={() => setDialogOpen(true)}>
            <Button variant="outline" className="w-64 truncate">
              <div>{"Select Images"}</div>
            </Button>
          </DialogTrigger>
        )}
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-50" />
        <DialogTrigger
          className="absolute top-0 bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => setDialogOpen(true)}
        >
          <Button variant="outline">Modify Images</Button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-6xl p-0 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="pt-6 px-6">
              <DialogTitle>Images</DialogTitle>
              <DialogDescription>Organize your images.</DialogDescription>
            </DialogHeader>
            {/* <div className="relative"> */}
            <div className="h-[400px] overflow-y-scroll border-y grid sm:grid-cols-2 lg:grid-cols-5 relative left-auto right-auto">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                  droppableId="droppable"
                  direction="horizontal"
                  renderClone={(provided, snapshot, rubric) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="relative m-4 h-52 w-52 top-auto left-auto"
                    >
                      <img
                        className={`rounded-lg object-cover aspect-square border-2 `}
                        src={images[rubric.source.index].value}
                      />
                    </div>
                  )}
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="lg:col-span-3 grid sm:grid-cols-2 md:grid-cols-3 "
                    >
                      {images.map((v, i) => (
                        <Draggable
                          key={`${v.value}-${i}`}
                          draggableId={`${v.value}-${i}`}
                          index={i}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="relative m-4 h-52 w-52 top-auto left-auto"
                            >
                              <img
                                className={`rounded-lg object-cover aspect-square border-2 ${
                                  selectedImageIdx === i
                                    ? "border-blue-500 "
                                    : "border-transparent"
                                }`}
                                src={v.value}
                                onClick={() => setSelectedImageIdx(i)}
                              />
                              <div className="absolute top-2 left-2 flex items-center justify-center w-6 h-6 bg-white rounded-full text-black">
                                {i + 1}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <div className="border-l flex-col lg:col-span-2">
                {replacingImage ? (
                  <ImageSelector
                    onChange={handleReplaceImage}
                    entityId={entityId}
                  />
                ) : (
                  <>
                    <div className="bg-gray-100 py-2 mb-4">
                      {/* TODO: fade image into view */}
                      <img
                        alt="Placeholder image"
                        className={`object-cover aspect-square mx-auto`}
                        height="200"
                        src={images[selectedImageIdx].value}
                        width="200"
                      />
                    </div>
                    <div className="px-4">
                      <Button
                        variant="outline"
                        onClick={() => setReplacingImage(true)}
                      >
                        Replace Image
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* </div> */}
            <div className="flex justify-end items-center p-2">
              <Button className="p-4" onClick={() => setDialogOpen(false)}>
                Done
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
