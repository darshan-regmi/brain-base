import { auth } from "@/auth";
import BrainBase from "@/components/landing";

export default async function Home() {
  const session = await auth();
  const isAuthed = !!session?.user?.id;
  const firstName = session?.user?.name?.split(" ")[0] ?? null;

  return <BrainBase isAuthed={isAuthed} firstName={firstName} />;
}
