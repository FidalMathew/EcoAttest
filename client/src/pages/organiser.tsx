import {Button} from "@/components/ui/button";
import useGlobalContextHook from "@/context/useGlobalContextHook";
import {OpenloginUserInfo} from "@web3auth/openlogin-adapter";
import {useEffect, useState} from "react";
import {Hex} from "viem";

export default function Organiser() {
  const {
    walletClient,
    login,
    publicClient,
    logout,
    getUserInfo,
    provider,
    loggedIn,
  } = useGlobalContextHook();
  const [loggedInAddress, setLoggedInAddress] = useState<string | null>(null);
  const [balanceAddress, setBalanceAddress] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<
    Partial<OpenloginUserInfo> | undefined
  >();

  const getUser = async () => {
    if (!getUserInfo) return;
    try {
      const userInfo = await getUserInfo();
      setUserInfo(userInfo);
      console.log(userInfo, "User info");
    } catch (error) {
      console.error(error, "Error user info");
    }
  };

  useEffect(() => {
    (async function () {
      try {
        if (walletClient && publicClient) {
          const [address] = await walletClient.getAddresses();
          console.log(address, "address");
          setLoggedInAddress(address);

          const balance = await publicClient.getBalance({
            address: address,
          });

          console.log(balance.toString(), "balance");
          setBalanceAddress(balance.toString());

          getUser();
        }
      } catch (error) {
        console.error(error, "Error logging in");
      }
    })();
  }, [walletClient, publicClient, provider, loggedIn]);

  return (
    <div>
      {loggedInAddress && balanceAddress && (
        <div>
          <div>Logged in as: {loggedInAddress}</div>
          <div>Balance: {balanceAddress}</div>
        </div>
      )}
      <div>
        <Button onClick={login}>Login</Button>
        <Button onClick={logout}>Logout</Button>
      </div>
    </div>
  );
}
