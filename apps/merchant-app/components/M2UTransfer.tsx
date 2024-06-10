"use client";

import { useState } from "react";
import { Button } from "../../../packages/ui/src/button";
import { Card } from "../../../packages/ui/src/card";
import { TextInput } from "../../../packages/ui/src/textinput";
import { m2utransfer } from "../lib/actions/m2utransfer";

export default function M2UTransfer() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(0);
  return (
    <div className="w-full">
      <Card title="M2U Transfer">
        <div className="flex  flex-col  gap-4 w-full">
          <TextInput
            placeholder="Phone Number"
            label="Phone Number"
            onChange={(e: any) => {
              setPhone(e);
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
              await m2utransfer(phone, amount);
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
