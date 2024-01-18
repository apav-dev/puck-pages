import { usePuck } from "@measured/puck";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../shadcn/Dropdown";
import { Button } from "../shadcn/Button";
import { useState } from "react";
import { useEditorContext } from "../../utils/useEditorContext";

type HeaderProps = {
  templateName?: string;
  actions?: React.ReactNode;
  entityId?: string;
};

// TODO: see if I can add the option to go forward and back in the editor
const Header = ({ actions, templateName, entityId }: HeaderProps) => {
  const { appState } = usePuck();
  const [position, setPosition] = useState("bottom");
  const { linkedTemplateEntity } = useEditorContext();

  console.log(appState);
  return (
    <div
      style={{ gridArea: "header" }}
      className="p-4 bg-white border-t border-b border-zinc-200 "
    >
      <div className="w-full justify-between items-center gap-4 grid grid-cols-3">
        <div className=" justify-start items-center gap-2 flex">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1713_10013)">
              <path
                d="M16 0C7.16356 0 0 7.16356 0 16C0 24.8364 7.16356 32 16 32C24.8364 32 32 24.8364 32 16C32 7.16356 24.8364 0 16 0ZM16 30.72C7.87022 30.72 1.28 24.1298 1.28 16C1.28 7.87022 7.87022 1.28 16 1.28C24.1298 1.28 30.72 7.87022 30.72 16C30.72 24.1298 24.1298 30.72 16 30.72Z"
                fill="black"
              />
              <path
                d="M16.5601 17.76H19.4401V23.52H20.7201V17.76H23.6001V16.48H16.5601V17.76Z"
                fill="black"
              />
              <path
                d="M14.8547 16.32L12.08 19.0951L9.30536 16.32L8.40002 17.2253L11.1751 20L8.40002 22.7747L9.30536 23.68L12.08 20.9049L14.8547 23.68L15.76 22.7747L12.9849 20L15.76 17.2253L14.8547 16.32Z"
                fill="black"
              />
              <path
                d="M20 15.52C21.988 15.52 23.6 13.908 23.6 11.92H22.32C22.32 13.2013 21.2814 14.24 20 14.24C19.6342 14.24 19.2885 14.1551 18.9809 14.0044L22.0845 10.9009L23.0214 9.96399C22.3796 8.9751 21.2667 8.32043 20 8.32043C18.0116 8.32043 16.4 9.93243 16.4 11.9204C16.4 13.9084 18.0116 15.52 20 15.52ZM20 9.59999C20.4498 9.59999 20.8694 9.72843 21.2249 9.95021L18.0302 13.1449C17.8085 12.7893 17.6805 12.3698 17.6805 11.92C17.68 10.6387 18.7187 9.59999 20 9.59999Z"
                fill="black"
              />
              <path
                d="M12.08 11.5369L9.38047 8.32001L8.40002 9.14267L11.44 12.7658V15.52H12.72V12.7658L15.76 9.14267L14.7796 8.32001L12.08 11.5369Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="clip0_1713_10013">
                <rect width="32" height="32" rx="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="justify-center items-center gap-2 flex flex-col">
          <div className="text-center text-black font-normal">
            {templateName}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{`Entity: ${entityId}`}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                {linkedTemplateEntity?.linkedEntityIds.map((entityId) => (
                  <DropdownMenuRadioItem value={entityId}>
                    {entityId}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-end gap-4">{actions}</div>
      </div>
    </div>
  );
};

export { Header };
