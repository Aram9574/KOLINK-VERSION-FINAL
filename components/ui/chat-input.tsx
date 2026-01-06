import * as React from "react";
import { Textarea } from "@/components/ui/textarea-shadcn";
import { cn } from "@/lib/utils";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => (
    <Textarea
      autoComplete="off"
      ref={ref}
      name="message"
      className={cn(
        "min-h-12 w-full resize-none border-0 bg-transparent px-3 py-3 text-sm placeholder:text-muted-foreground focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  ),
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
