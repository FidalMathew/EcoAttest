import useGlobalContextHook from "@/context/useGlobalContextHook";
import QRX from "@qr-x/react";
import { useEffect, useState } from "react";

export default function RequestOrganiser() {

  const { getAllOrganizations, status, walletClient } = useGlobalContextHook();

  const [userAddress, setUserAddress] = useState<String>("");
  const [qrValue, setQrValue] = useState<string>("");

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (getAllOrganizations) {
        const res = await getAllOrganizations();
        console.log(res, "organizations");
      }

      if (walletClient) {

        const [address] = await walletClient.getAddresses();
        console.log(address, "address");
        setUserAddress(address);
      }
    }


    if (status == 'connected') {
      fetchOrganizations()
    }
  }, [status])


  const requestAttestion = (organization: String, event: String,) => {
    const schemaTemplate = {
      organization,
      event,
      participant: userAddress
    }
    const schema = JSON.stringify(schemaTemplate);

    // let test = "sda"
    setQrValue(schema);

  }

  return (
    <div>
      <button onClick={() => requestAttestion("Uber", "carpooling")}>check</button>
      <div className="flex items-center justify-center">
        {/* {userAddress} */}
        <div className="w-1/4 h-1/2">

          {
            qrValue &&
            <QRX
              data={qrValue}
              color="rgb(20, 93, 20)"
              shapes={{
                body: "circle",
                eyeball: "circle",
                eyeframe: "rounded",
              }}
            />
          }
        </div>
      </div>
    </div>
  );
}

/*
 // "@nillion/client-core": "^0.1.0-rc.12",
    // "@nillion/client-payments": "^0.1.0-rc.12",
    // "@nillion/client-react-hooks": "^0.1.0-rc.12",
    // "@nillion/client-vms": "^0.1.0-rc.12",
    // "@nillion/client-web": "^0.5.0",

*/
