import Dashboard from "../../../components/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
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
        { fromMerchantId: session?.user?.id },
        { toMerchantId: session?.user?.id },
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

// export default async function DashboardPage() {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect('/signin');
//   }

//   // const transactions = await prisma.p2PTransfer.findMany({
//   //   where: { fromUserId: userId }
//   // });

//   // const transactionsTo = await prisma.p2PTransfer.findMany({
//   //   where: { toUserId: userId }
//   // });

//   // const data = transactions.map(transaction => ({
//   //   amount: transaction.amount,
//   //   timestamp: new Date(transaction.timestamp).toISOString()
//   // }));

//   // const dataTo = transactionsTo.map(transaction => ({
//   //   amount: transaction.amount,
//   //   timestamp: new Date(transaction.timestamp).toISOString()
//   // }));

//   // const mergedData = [...data, ...dataTo];
//   // // @ts-ignore
//   // mergedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

//   // console.log("data is the key", data)
//   // console.log("data is the key", dataTo)
//   // console.log("merged array is", mergedData)

//   const transactions = await prisma.p2PTransfer.findMany({
//     where: {
//       OR: [
//         { fromMerchantId: session?.user?.id },
//         { toMerchantId: session?.user?.id },
//       ],
//     },
//     orderBy: {
//       timestamp: "desc",
//     },
//   });

//   const data = transactions.map(transaction => ({
//     amount: transaction.amount,
//     timestamp: new Date(transaction.timestamp).toISOString()
//   }));

//   console.log(data);

//   return { props:{ data, session} };

//   // return {
//   //   props: {
//   //     session,
//   //     mergedData,
//   //   },
//   // };
// }

// interface DashboardPageProps {
//   session: any;
//   data: { amount: number; timestamp: string }[];
// }

// const DashboardPage: React.FC<DashboardPageProps> = ({ session, data }) => {
//   // const props = getProps();
//   const name = session?.user.name;
//   // @ts-ignore
//   const amounts = data.map(transaction => transaction.amount);
//   // @ts-ignore
//   const times = data.map(transaction => transaction.timestamp);

//   return (
//     <div className="flex flex-col items-center justify-center w-full p-4 gap-4 -mt-4">
//       <div className="mb-4 text-2xl font-bold">Welcome Back, {name}</div>
//       {/* @ts-ignore */}
//       <Dashboard amounts={amounts} times={times}/>
//     </div>
//   );
// }