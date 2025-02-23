"use client";
import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
  Suspense,
} from "react";
import { PopupManager } from "@/lib/PopupManager";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  XSquare,
} from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

type Status = "idle" | "pending" | "success" | "error" | "cancelled" | "closed";

const DepositPage: React.FC = () => {
  const popupManager = useMemo(() => PopupManager.getInstance(), []);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const handleIframeMessageRef = useRef<((event: MessageEvent) => void) | null>(
    null
  );

  const updateStatus = useCallback((newStatus: Status, message: string) => {
    setStatus(newStatus);
    setStatusMessage(message);
  }, []);

  handleIframeMessageRef.current = useCallback(
    (event: MessageEvent) => {
      if (!event.data) return;

      const { type, url } = event.data;
      if (type === "OPEN_OTP_POPUP" && url) {
        setStatus("idle");
        setStatusMessage("");

        const callbackUrl = `${window.location.origin}/success-callback`;
        const iframe =
          document.querySelector<HTMLIFrameElement>("#deposit-iframe");

        updateStatus("pending", "Verification in progress...");

        popupManager.openPopup({
          targetUrl: url,
          callbackUrl,
          onSuccess: (data) => {
            updateStatus("success", "Verification successful");
            iframe?.contentWindow?.postMessage(
              { type: "OTP_VERIFIED", data },
              "*"
            );
          },
          onCancel: (reason?: string) => {
            if (reason === "user_cancelled") {
              updateStatus("cancelled", "Verification cancelled by user");
              iframe?.contentWindow?.postMessage(
                { type: "OTP_CANCELLED", data: { message: "User cancelled" } },
                "*"
              );
            } else {
              updateStatus("closed", "Verification window closed");
              iframe?.contentWindow?.postMessage(
                {
                  type: "OTP_CANCELLED",
                  data: { message: "Tab closed by user" },
                },
                "*"
              );
            }
          },
          onError: (error) => {
            updateStatus("error", error.message || "Verification failed");
            iframe?.contentWindow?.postMessage(
              { type: "OTP_ERROR", error: error.message },
              "*"
            );
          },
        });
      }
    },
    [popupManager, updateStatus]
  );

  useLayoutEffect(() => {
    const handler = (event: MessageEvent) => {
      handleIframeMessageRef.current?.(event);
    };

    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  const StatusIndicator: React.FC<{ status: Status; message: string }> =
    React.memo(({ status, message }) => {
      const getStatusColor = () => {
        switch (status) {
          case "success":
            return "bg-green-100 text-green-800 border-green-200";
          case "error":
            return "bg-red-100 text-red-800 border-red-200";
          case "cancelled":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "closed":
            return "bg-gray-100 text-gray-600 border-gray-200";
          case "pending":
            return "bg-blue-100 text-blue-800 border-blue-200";
          default:
            return "hidden";
        }
      };

      const getStatusIcon = () => {
        switch (status) {
          case "success":
            return <CheckCircle2 className="w-5 h-5 text-green-500" />;
          case "error":
            return <XCircle className="w-5 h-5 text-red-500" />;
          case "cancelled":
            return <AlertCircle className="w-5 h-5 text-yellow-500" />;
          case "closed":
            return <XSquare className="w-5 h-5 text-gray-500" />;
          case "pending":
            return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
          default:
            return null;
        }
      };

      return status !== "idle" ? (
        <div
          className={`mt-4 p-4 rounded-lg border ${getStatusColor()} flex items-center space-x-2`}
        >
          <div className="flex-shrink-0">{getStatusIcon()}</div>
          <span className="text-sm font-medium">{message}</span>
        </div>
      ) : null;
    });

  StatusIndicator.displayName = "StatusIndicator";

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Spinner size="lg" />
        </div>
      }
    >
      <main className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-semibold mb-4">Deposit Page</h1>
        <iframe
          id="deposit-iframe"
          src={`${process.env.NEXT_PUBLIC_IFRAME_URL}`}
          title="External Deposit App"
          className="w-full max-w-3xl h-[400px] border border-gray-300 rounded"
          tabIndex={0}
        />
        <StatusIndicator status={status} message={statusMessage} />
      </main>
    </Suspense>
  );
};

export default DepositPage;
