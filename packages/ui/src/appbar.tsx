import { Button } from "./button";

interface AppbarProps {
    user?: {
        name?: string | null;
    },
    // type for onSignin and onSignout
    onSignin: any,
    onSignout: any
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="flex justify-between border-b px-4 text-[#6a51a6] bg-white">
        <div className="text-2xl font-bold flex flex-col justify-center text-[#6a51a6]">
            GoFinance
        </div>
        <div className="flex flex-col justify-center pt-2">
            <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
        </div>
    </div>
}
