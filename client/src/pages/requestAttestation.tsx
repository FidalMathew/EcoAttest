import useGlobalContextHook from "@/context/useGlobalContextHook";
import QRX from "@qr-x/react";
import { useState } from "react";

export default function RequestAttestation() {

  const [qrValue, setQrValue] = useState<string>("");
  const { loggedInAddress } = useGlobalContextHook();

  const requestAttestion = (orgAddress: string, eventId: number) => {
    const schemaTemplate = {
      orgAddress: orgAddress,
      eventId: eventId,
      participant: loggedInAddress,
    };

    const url = schemaTemplate.toString();
    setQrValue(url);
  };

  return (
    <div>
      <button onClick={() => requestAttestion("Uber", 1)}>
        check
      </button>
      <div className="flex items-center justify-center">
        {/* {userAddress} */}
        <div className="w-1/4 h-1/2">
          {qrValue && (
            <QRX
              data={qrValue}
              color="rgb(20, 93, 20)"
              shapes={{
                body: "circle",
                eyeball: "circle",
                eyeframe: "rounded",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );

}
