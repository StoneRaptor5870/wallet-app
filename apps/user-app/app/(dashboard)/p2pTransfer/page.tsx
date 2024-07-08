import prisma from "@repo/db/client";
import P2PTransfer from "../../../components/SendMoneyCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { P2pTransactions } from "../../../components/P2PTransactions";

const getp2ptransaction = async () => {
  const session = await getServerSession(authOptions);
  const transactions = await prisma.p2PTransfer.findMany({
    where: {
      OR: [{ fromUserId: session?.user?.id }, { toUserId: session?.user?.id }],
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return transactions;
};

export default async function () {
  const transactions = await getp2ptransaction();
  return (
    <div className="w-full">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Peer to Peer Transfer
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-20">
        <div className="w-full">
          <P2PTransfer />
        </div>
        <div className="w-full">
          <P2pTransactions transactions={transactions} />
        </div>
        {/* <div className="w-full">
          <BalanceHistory history={balanceHistory} />
        </div> */}
      </div>
    </div>
  );
}
