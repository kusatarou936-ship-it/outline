// app/submit/page.tsx
import InternalSubmit from "../../submit/internal/InternalSubmit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function Page() {
  return <InternalSubmit />;
}
