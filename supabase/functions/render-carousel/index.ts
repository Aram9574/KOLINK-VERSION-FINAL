import { serve } from "std/http/server.ts";
import { handler } from "./handler.tsx";

serve(handler);
