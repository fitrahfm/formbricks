"use client";

import { getPlacementStyle } from "@/lib/preview";
import { cn } from "@formbricks/lib/cn";
import { PlacementType } from "@formbricks/types/js";
import type { Survey } from "@formbricks/types/surveys";
import { ColorPicker, Label, RadioGroup, RadioGroupItem, Switch } from "@formbricks/ui";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";

interface StylingCardProps {
  localSurvey: Survey;
  setLocalSurvey: (survey: Survey) => void;
}

export default function StylingCard({ localSurvey, setLocalSurvey }: StylingCardProps) {
  const [open, setOpen] = useState(false);
  const autoComplete = localSurvey.autoComplete !== null;
  const [surveyCloseOnDateToggle, setSurveyCloseOnDateToggle] = useState(false);

  const [color, setColor] = useState("#526988");

  const handleSurveyCloseOnDateToggle = () => {
    if (surveyCloseOnDateToggle && localSurvey.closeOnDate) {
      setSurveyCloseOnDateToggle(false);

      setLocalSurvey({ ...localSurvey, closeOnDate: null });
      return;
    }

    if (surveyCloseOnDateToggle) {
      setSurveyCloseOnDateToggle(false);
      return;
    }
    setSurveyCloseOnDateToggle(true);
  };

  const handleCheckMark = () => {
    if (autoComplete) {
      const updatedSurvey: Survey = { ...localSurvey, autoComplete: null };
      setLocalSurvey(updatedSurvey);
    } else {
      const updatedSurvey: Survey = { ...localSurvey, autoComplete: 25 };
      setLocalSurvey(updatedSurvey);
    }
  };

  const placements = [
    { name: "Bottom Right", value: "bottomRight", disabled: false },
    { name: "Top Right", value: "topRight", disabled: false },
    { name: "Top Left", value: "topLeft", disabled: false },
    { name: "Bottom Left", value: "bottomLeft", disabled: false },
    { name: "Centered Modal", value: "center", disabled: false },
  ];

  const [currentPlacement, setCurrentPlacement] = useState<PlacementType>("bottomRight");
  const [overlay, setOverlay] = useState("");
  const [clickOutside, setClickOutside] = useState("");

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="w-full rounded-lg border border-slate-300 bg-white">
      <Collapsible.CollapsibleTrigger asChild className="h-full w-full cursor-pointer">
        <div className="inline-flex px-4 py-4">
          <div className="flex items-center pl-2 pr-5">
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Styling</p>
            <p className="mt-1 truncate text-sm text-slate-500">Overwrite global styling settings</p>
          </div>
        </div>
      </Collapsible.CollapsibleTrigger>
      <Collapsible.CollapsibleContent>
        <hr className="py-1 text-slate-600" />
        <div className="p-3">
          {/* Brand Color */}
          <div className="p-3">
            <div className="ml-2 flex items-center space-x-1">
              <Switch id="autoComplete" checked={autoComplete} onCheckedChange={handleCheckMark} />
              <Label htmlFor="autoComplete" className="cursor-pointer">
                <div className="ml-2">
                  <h3 className="text-sm font-semibold text-slate-700">Brand Color</h3>
                  <p className="text-xs font-normal text-slate-500">
                    Overwrite the main color for this survey.
                  </p>
                </div>
              </Label>
            </div>
            {autoComplete && (
              <div className="ml-2 mt-4 rounded-lg border bg-slate-50 p-4">
                <div className="w-full max-w-xs">
                  <Label htmlFor="brandcolor">Color (HEX)</Label>
                  <ColorPicker color={color} onChange={setColor} />
                </div>
              </div>
            )}
          </div>
          {/* positioning */}
          <div className="p-3 ">
            <div className="ml-2 flex items-center space-x-1">
              <Switch
                id="surveyDeadline"
                checked={surveyCloseOnDateToggle}
                onCheckedChange={handleSurveyCloseOnDateToggle}
              />
              <Label htmlFor="surveyDeadline" className="cursor-pointer">
                <div className="ml-2">
                  <h3 className="text-sm font-semibold text-slate-700">Positioning</h3>
                  <p className="text-xs font-normal text-slate-500">
                    Overwrite the positioning of this survey
                  </p>
                </div>
              </Label>
            </div>
            {surveyCloseOnDateToggle && (
              <div className="ml-2 mt-4 flex items-center space-x-1 pb-4">
                <div className="flex w-full cursor-pointer items-center rounded-lg  border bg-slate-50 p-4">
                  <div className="w-full items-center">
                    <div className="flex">
                      <RadioGroup
                        onValueChange={(e) => setCurrentPlacement(e as PlacementType)}
                        value={currentPlacement}>
                        {placements.map((placement) => (
                          <div
                            key={placement.value}
                            className="flex items-center space-x-2 whitespace-nowrap">
                            <RadioGroupItem
                              id={placement.value}
                              value={placement.value}
                              disabled={placement.disabled}
                            />
                            <Label
                              htmlFor={placement.value}
                              className={cn(
                                placement.disabled ? "cursor-not-allowed text-slate-500" : "text-slate-900"
                              )}>
                              {placement.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <div className="relative ml-8 h-40 w-full rounded bg-slate-200">
                        <div
                          className={cn(
                            "absolute h-16 w-16 rounded bg-slate-700",
                            getPlacementStyle(currentPlacement)
                          )}></div>
                      </div>
                    </div>

                    {currentPlacement === "center" && (
                      <>
                        <div className="mt-6 space-y-2">
                          <Label className="font-semibold">Centered modal overlay color</Label>
                          <RadioGroup
                            onValueChange={(e) => setOverlay(e)}
                            value={overlay}
                            className="flex space-x-4">
                            <div className="flex items-center space-x-2 whitespace-nowrap">
                              <RadioGroupItem id="lightOverlay" value="lightOverlay" />
                              <Label htmlFor="lightOverlay" className="text-slate-900">
                                Light Overlay
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 whitespace-nowrap">
                              <RadioGroupItem id="darkOverlay" value="darkOverlay" />
                              <Label htmlFor="darkOverlay" className="text-slate-900">
                                Dark Overlay
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="mt-6 space-y-2">
                          <Label className="font-semibold">
                            Allow users to exit by clicking outside the study
                          </Label>
                          <RadioGroup
                            onValueChange={(e) => setClickOutside(e)}
                            value={clickOutside}
                            className="flex space-x-4">
                            <div className="flex items-center space-x-2 whitespace-nowrap">
                              <RadioGroupItem id="disallow" value="disallow" />
                              <Label htmlFor="disallow" className="text-slate-900">
                                Don&apos;t Allow
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 whitespace-nowrap">
                              <RadioGroupItem id="allow" value="allow" />
                              <Label htmlFor="allow" className="text-slate-900">
                                Allow
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Collapsible.CollapsibleContent>
    </Collapsible.Root>
  );
}
