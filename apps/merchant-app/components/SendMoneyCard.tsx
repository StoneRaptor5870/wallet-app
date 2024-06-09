"use client";

import { useState } from "react";
import { Button } from "../../../packages/ui/src/button";
import { Card } from "../../../packages/ui/src/card";
import { TextInput } from "../../../packages/ui/src/textinput";
import { p2ptransfer } from "../lib/actions/p2ptransfer";

export default function P2PTransfer() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);
  return (
    <div className="w-full">
      <Card title="P2P Transfer">
        <div className="flex  flex-col  gap-4 w-full">
          <TextInput
            placeholder="Email"
            label="Email"
            onChange={(e: any) => {
              setEmail(e);
            }}
          />
          <TextInput
            placeholder="Amount"
            label="Amount"
            onChange={(e: any) => {
              setAmount(e);
            }}
          />
          <Button
            onClick={async () => {
              await p2ptransfer(email, amount);
              location.reload();
            }}
          >
            Transfer
          </Button>
        </div>
      </Card>
    </div>
  );
}
