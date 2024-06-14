import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import M2UTransfer from "../../../components/M2UTransfer";
import { M2UTransactions } from "../../../components/M2UTransactions";

const getm2utransaction = async () => {
  const session = await getServerSession(authOptions);
  const transactions = await prisma.p2PTransfer.findMany({
    where: {
      OR: [
        { fromMerchantId: session?.user?.id },
        { toUserId: session?.user?.id },
      ],
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return transactions;
};

export default async function M2U() {
  const transactions = await getm2utransaction();
  return (
    <div className="w-full">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
      Merchant to User Transfer
    </div>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-20">
      <div className="w-full">
        <M2UTransfer />
      </div>
      <div className="w-full">
        <M2UTransactions transactions={transactions} />
      </div>
    </div>
    </div>
  );
}
