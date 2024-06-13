import Dashboard from "../../../components/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  const transactions = await prisma.p2PTransfer.findMany({
    where: {
      OR: [
        { fromUserId: session?.user?.id },
        { toUserId: session?.user?.id },
        { toMerchantId: session?.user?.id },
        { fromMerchantId: session?.user?.id },
      ],
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const data = transactions.map(transaction => ({
    amount: transaction.amount,
    timestamp: new Date(transaction.timestamp).toISOString(),
  }));

  const name = session?.user?.name;
  const amounts = data.map(transaction => transaction.amount);
  const times = data.map(transaction => transaction.timestamp);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-4 -mt-4">
      <div className="mb-4 text-2xl font-bold">Welcome Back, {name}</div>
      <Dashboard amounts={amounts} times={times}/>
    </div>
  );
}