import { redirect } from "next/navigation";

/**
 * Auth disabled for local development — redirect to projects.
 */
export default function SignInPage() {
  redirect("/projects");
}
