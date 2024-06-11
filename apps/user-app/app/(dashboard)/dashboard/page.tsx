import Dashboard from "../../../components/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

export async function getProps() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // const transactions = await prisma.p2PTransfer.findMany({
  //   where: { fromUserId: userId }
  // });

  // const transactionsTo = await prisma.p2PTransfer.findMany({
  //   where: { toUserId: userId }
  // });

  // const data = transactions.map(transaction => ({
  //   amount: transaction.amount,
  //   timestamp: new Date(transaction.timestamp).toISOString()
  // }));

  // const dataTo = transactionsTo.map(transaction => ({
  //   amount: transaction.amount,
  //   timestamp: new Date(transaction.timestamp).toISOString()
  // }));

  // const mergedData = [...data, ...dataTo];
  // // @ts-ignore
  // mergedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // console.log("data is the key", data)
  // console.log("data is the key", dataTo)
  // console.log("merged array is", mergedData)

  const transactions = await prisma.p2PTransfer.findMany({
    where: {
      OR: [
        { fromUserId: session?.user?.id },
        { toUserId: session?.user?.id },
      ],
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return { props:{ transactions, session} };

  // return {
  //   props: {
  //     session,
  //     mergedData,
  //   },
  // };
}

export default async function DashboardPage() {
  const props = await getProps();
  const name = props.props.session?.user.name;
  // @ts-ignore
  const amounts = props.props.transactions.map(transaction => transaction.amount);
  // @ts-ignore
  const times = props.props.transactions.map(transaction => transaction.timestamp);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-4 -mt-4">
      <div className="mb-4 text-2xl font-bold">Welcome Back, {name}</div>
      {/* @ts-ignore */}
      <Dashboard amounts={amounts} times={times}/>
    </div>
  );
}
