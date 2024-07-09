import { Card } from "@repo/ui/card";

export const Balances = ({ balances }: any) => {
  if (!balances.length) {
    return (
      <Card title="Balances">
        <div className="text-center pb-8 pt-8">No balances available</div>
      </Card>
    );
  }

  return (
    <div className="w-full h-full">
      <Card title="Balances">
        <div style={{"maxHeight": "70vh", "overflowY": "auto", "paddingTop": "0.5rem"}}>
          {balances.map((balance: any, index: any) => (
            <div key={index} className="mb-4">
              <div>ID: {balance.id}</div>
              <div>Balance: {balance.amount}</div>
              <div>
                Timestamp: {new Date(balance.timestamp).toLocaleString()}
              </div>
              {balance.p2pTransfer && (
                <div className="pl-4">
                  <div>P2P Transfer:</div>
                  <div>Amount: {balance.p2pTransfer.amount}</div>
                </div>
              )}
              {balance.onRampTxn && (
                <div className="pl-4">
                  <div>OnRamp Transaction:</div>
                  <div>Amount Added: {balance.onRampTxn.amount}</div>
                  <div>Status: {balance.onRampTxn.status}</div>
                </div>
              )}
              <hr className="my-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Balances;
