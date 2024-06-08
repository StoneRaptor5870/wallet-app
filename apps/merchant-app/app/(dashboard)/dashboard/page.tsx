import Dashboard from "../../../components/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name;

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-4 -mt-4">
      <div className="mb-4 text-2xl font-bold">Welcome Back, {name}</div>
      <Dashboard />
    </div>
  );
}
