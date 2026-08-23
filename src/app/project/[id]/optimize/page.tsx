import { redirect } from "next/navigation";

export default function OptimizePage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/project/${params.id}/report`);
}
