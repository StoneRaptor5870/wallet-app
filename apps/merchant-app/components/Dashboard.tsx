"use client";

import { Card } from "@repo/ui/card";

export default function Home() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Card title="Home">
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
              This feature lets you transfer money to another user by their email.
            </div>
          </div>
          <div className="w-full p-4">
            <p className="text-xl">Merchant to User Transfer</p>
            <div>
              This feature lets you transfer money to an end-user by their phone number.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
