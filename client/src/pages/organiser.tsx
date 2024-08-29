import {Button} from "@/components/ui/button";
import useGlobalContextHook from "@/context/useGlobalContextHook";

export default function Organiser() {
  const {walletClient, publicClient, login, logout} = useGlobalContextHook();
  return (
    <div>
      <div>
        {walletClient && <pre>{JSON.stringify(walletClient, null, 2)}</pre>}
      </div>
      <div>
        {publicClient && <pre>{JSON.stringify(publicClient, null, 2)}</pre>}
      </div>
      <div>
        <Button onClick={login}>Login</Button>
      </div>
    </div>
  );
}
