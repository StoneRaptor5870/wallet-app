export default function Home() {
  return (
    <div className="w-full h-body flex justify-center items-center flex-col gap-2 bg-black">
      <h1 className="text-3xl font-bold">A Wallet App</h1>
      <p>This app uses mongoDB transactions in backend to mimic payments.</p>
    </div>
  );
}
