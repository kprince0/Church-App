"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Direction = "horizontal" | "vertical";

type ResizablePanelGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  direction?: Direction;
};

type ResizablePanelProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
};

type ResizableHandleProps = React.HTMLAttributes<HTMLDivElement> & {
  withHandle?: boolean;
};

const ResizablePanelGroup = React.forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  ({ className, direction = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      data-panel-group-direction={direction}
      className={cn(
        "flex h-full w-full",
        direction === "vertical" ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    />
  )
);
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ className, defaultSize, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("min-w-0 min-h-0", className)}
      style={{
        flexGrow: defaultSize ? defaultSize : 1,
        flexBasis: defaultSize ? `${defaultSize}%` : undefined,
        ...style,
      }}
      {...props}
    />
  )
);
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ withHandle, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex w-px items-center justify-center bg-border data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <div className="h-2 w-px bg-muted-foreground" />
        </div>
      )}
    </div>
  )
);
ResizableHandle.displayName = "ResizableHandle";

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
export type ResizablePanelRef = HTMLDivElement;
