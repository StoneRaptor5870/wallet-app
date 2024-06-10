import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import U2MTransfer from "../../../components/U2MSendMoneyCard";
import { U2MTransactions } from "../../../components/U2MTransactions";

const getu2ptransaction = async () => {
  const session = await getServerSession(authOptions);
  const transactions = await prisma.p2PTransfer.findMany({
    where: {
      OR: [
        { fromUserId: session?.user?.id },
        { toMerchantId: session?.user?.id },
      ],
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return transactions;
};

export default async function () {
  const transactions = await getu2ptransaction();
  return (
    <div className="w-full">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        User to Merchant Transfer
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-20">
        <div className="w-full">
          <U2MTransfer />
        </div>
        <div className="w-full">
          <U2MTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
