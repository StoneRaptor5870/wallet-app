"use client";

import { Card } from "@repo/ui/card";
import LineChart from "./TimeSeries";

interface DashboardProps {
  amounts: number[];
  times: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ amounts, times }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Card title="Home">
      <div className="flex flex-col justify-center items-center w-[60%] h-[60%] gap-4 mb-8">
        {/* @ts-ignore */}
        <LineChart amounts={amounts} times={times} />
        <div className="flex justify-center items-center p-4">This time series graph tells about the peer to peer transactions made by the user. 
          Amount inflow and outflow, you can change the time axis with given buttons too.</div>
      </div>
        <div className="flex flex-col justify-center items-center">
          <div className="w-full p-4">
            <p className="text-xl">Bank to Wallet Transfer</p>
            <div>
              This feature lets you withdraw money from a dummy bank api which
              approves the request for the withdrawal, as a web hook and then
              the wallet server receives the approval, finally adding money to
              the wallet balance.
            </div>
          </div>
          <div className="w-full p-4">
            <p className="text-xl">Peer to Peer Transfer</p>
            <div>
              This feature lets you transfer money to another user by their phone number.
            </div>
          </div>
          <div className="w-full p-4">
            <p className="text-xl">User to Merchant Transfer</p>
            <div>
              This feature lets you transfer money to merchant by their email.
            </div>
          </div>
          <div className="w-full p-4">
            <p className="text-xl">Balance History</p>
            <div>
              This feature lets you see all your transactions that you made to your peers, merchants and the money added to your wallet.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;