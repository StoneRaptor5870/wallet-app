import Dashboard from "../../../components/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { redirect } from 'next/navigation';

interface MappedTransaction {
  amount: number;
  timestamp: string;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  // Fetch balance history for the user
  const balanceHistory = await prisma.balanceHistory.findMany({
    where: {
      balance: {
        OR: [
          { userId: session.user.id },
          { merchantId: session.user.id }
        ],
      },
    },
    include: {
      balance: true,
      p2pTransfer: true,
      onRampTxn: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  // Map balance history entries to the desired format
  const data: MappedTransaction[] = balanceHistory.map((history) => ({
    amount: history.amount,
    timestamp: new Date(history.timestamp).toISOString(),
  }));

  // Ensure data is sorted by timestamp
  data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  console.log("---------------------------------data---------------------------", data);

  const name = session.user.name;
  const amounts = data.map(transaction => transaction.amount);
  const times = data.map(transaction => transaction.timestamp);

  console.log("times-------------------", times);
  console.log("amounts--------------------", amounts);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-4 -mt-4">
      <div className="mb-4 text-2xl font-bold">Welcome Back, {name}</div>
      <Dashboard amounts={amounts} times={times}/>
    </div>
  );
}
