import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import Balances from "../../../components/Balances";

const balanceHistory = async () => {
  const session = await getServerSession(authOptions);
  const balances = await prisma.balanceHistory.findMany({
    where: {
      balance: {
        merchantId: session?.user.id,
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

  return balances;
};

export default async function () {
  const balances = await balanceHistory();
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Balance History
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-full max-w-screen-lg px-4">
          <Balances balances={balances} />
        </div>
      </div>
    </div>
  );
}
