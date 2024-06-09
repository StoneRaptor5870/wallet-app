import { Card } from "@repo/ui/card";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../app/lib/auth";

export const P2pTransactions = async ({
  transactions,
}: {
  transactions: {
    amount: number;
    fromUserId: string;
    toUserId: string;
    timestamp: Date;
  }[];
}) => {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;

  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }

  return (
    <Card title="Recent Transactions">
      <div style={{ maxHeight: '16rem', overflowY: 'auto', paddingTop: '0.5rem' }}>
        {transactions.map((t) => (
          <div className="flex w-full justify-between my-2">
            {t.toUserId === id ? (
              <div className="flex w-full justify-between my-2">
                <div>
                  <div className="text-sm">Received INR</div>
                  <div className="text-slate-600 text-xs">
                    {t.timestamp.toDateString()}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  + Rs {t.amount}
                </div>
              </div>
            ) : (
              <div className="flex w-full justify-between my-2">
                <div>
                  <div className="text-sm">Sent INR</div>
                  <div className="text-slate-600 text-xs">
                    {t.timestamp.toDateString()}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  - Rs {t.amount}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
