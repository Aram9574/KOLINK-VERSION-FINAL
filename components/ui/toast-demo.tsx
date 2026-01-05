import React from "react";
import { useToasts } from "./toast";
import { Button } from "./button-1";

export default function ToastDemo() {
  const toasts = useToasts();
  return (
    <div className="flex gap-4 p-8 items-center justify-center flex-wrap">
      <Button
        onClick={() => {
          toasts.message({
            text: "The Evil Rabbit jumped over the fence.",
            action: "Undo",
            onAction: () => console.log("Undo clicked"),
          });
        }}
        type="secondary"
      >
        Show Message
      </Button>

      <Button
        onClick={() => {
          toasts.success("Successfully deployed production.");
        }}
        type="primary"
        className="bg-green-600 hover:bg-green-700"
      >
        Show Success
      </Button>

      <Button
        onClick={() => {
          toasts.error("Failed to connect to database.");
        }}
        type="error"
      >
        Show Error
      </Button>

      <Button
        onClick={() => {
          toasts.warning("Your session is about to expire.");
        }}
        type="warning"
      >
        Show Warning
      </Button>
    </div>
  );
}
