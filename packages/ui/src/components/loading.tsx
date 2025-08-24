"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse" | "jimu";
  fullScreen?: boolean;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      className,
      size = "md",
      variant = "spinner",
      fullScreen = false,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };

    const containerClasses = {
      sm: "min-h-16",
      md: "min-h-32",
      lg: "min-h-64",
    };

    if (variant === "dots") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-center",
            containerClasses[size],
            className
          )}
          {...props}
        >
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      );
    }

    if (variant === "pulse") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-center",
            containerClasses[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "rounded-full bg-blue-600 animate-pulse",
              sizeClasses[size]
            )}
          ></div>
        </div>
      );
    }

    if (variant === "jimu") {
      return (
        <div
          ref={ref}
          className={cn(
            "loader",
            fullScreen ? "fixed inset-0 bg-white/80 z-50" : "absolute inset-0",
            className
          )}
          {...props}
        >
          <div className="justify-content-center jimu-primary-loading"></div>
          <style jsx>{`
            .loader {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
            }

            .jimu-primary-loading:before,
            .jimu-primary-loading:after {
              position: absolute;
              top: 0;
              content: "";
            }

            .jimu-primary-loading:before {
              left: -19.992px;
            }

            .jimu-primary-loading:after {
              left: 19.992px;
              -webkit-animation-delay: 0.32s !important;
              animation-delay: 0.32s !important;
            }

            .jimu-primary-loading:before,
            .jimu-primary-loading:after,
            .jimu-primary-loading {
              background: #076fe5;
              -webkit-animation: loading-keys-app-loading 0.8s infinite
                ease-in-out;
              animation: loading-keys-app-loading 0.8s infinite ease-in-out;
              width: 13.6px;
              height: 32px;
            }

            .jimu-primary-loading {
              text-indent: -9999em;
              margin: auto;
              position: absolute;
              right: calc(50% - 6.8px);
              top: calc(50% - 16px);
              -webkit-animation-delay: 0.16s !important;
              animation-delay: 0.16s !important;
            }

            @-webkit-keyframes loading-keys-app-loading {
              0%,
              80%,
              100% {
                opacity: 0.75;
                box-shadow: 0 0 #076fe5;
                height: 32px;
              }

              40% {
                opacity: 1;
                box-shadow: 0 -8px #076fe5;
                height: 40px;
              }
            }

            @keyframes loading-keys-app-loading {
              0%,
              80%,
              100% {
                opacity: 0.75;
                box-shadow: 0 0 #076fe5;
                height: 32px;
              }

              40% {
                opacity: 1;
                box-shadow: 0 -8px #076fe5;
                height: 40px;
              }
            }
          `}</style>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          containerClasses[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
            sizeClasses[size]
          )}
        />
      </div>
    );
  }
);
Loading.displayName = "Loading";

export { Loading };
