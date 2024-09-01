import {useEffect, useState} from "react";
// import * as nillion from "@nillion/client-web";

// import {
//   useFetchProgramOutput,
//   useRunProgram,
//   useStoreProgram,
// } from "@nillion/client-react-hooks";
import {Button} from "@/components/ui/button";
// import {useNillion} from "@nillion/client-react-hooks";
// import {transformNadaProgramToUint8Array} from "@/nillion/helpers/nadaToUint";
// import {ComputerIcon} from "lucide-react";
// import {handleGenerateUserKey} from "@/nillion/helpers/generateUserKey";

export default function Participant() {
  const [userId, setUserId] = useState<any | undefined>(undefined);
  // const runProgram = useRunProgram();
  // // const [programID, setProgramID] = useState<ProgramId | undefined>(undefined);
  // const [computeID, setComputeID] = useState<any | undefined>(undefined);
  // const [computeResult, setComputeResult] = useState<string | undefined>(
  //   undefined
  // );
  // const fetchProgram = useFetchProgramOutput({
  //   id: computeID,
  // });
  // const storeProgram = useStoreProgram();

  const PROGRAM_NAME = "compute_carbon_score";
  const organiserUserId = "AABK3PYV4NkXSCKBFxypuqxDgqfo3VijehroUQCQd9nn";
  const programID =
    "4GyRYiBio56jPPWKB58jbknaTLS7528SjPR2S5ExDC4XhZQnSSDh6yvnbpyn4vEEj9pqFKNyfTWzcc8LMTgn4Cia/compute_carbon_score";

  // const generateUserID = async () => {
  //   try {
  //     await nillion.default();

  //     const userKey = nillion.UserKey.generate();
  //     setUserId(userKey.to_base58());
  //   } catch (error) {
  //     console.log("error in generating user id", error);
  //   }
  // };

  // const handleStoreProgram = async () => {
  //   try {
  //     const programBinary = await transformNadaProgramToUint8Array(
  //       `./programs/${PROGRAM_NAME}.nada.bin`
  //     );
  //     const result = await storeProgram.mutateAsync({
  //       name: PROGRAM_NAME,
  //       program: programBinary,
  //     });
  //     setProgramID(result!);
  //   } catch (error) {
  //     console.log("error in storing program", error);
  //   }
  // };

  // useEffect(() => {
  //   if (fetchProgram.data) {
  //     // @ts-ignore
  //     setComputeResult(fetchProgram.data.total_feedback.toString());
  //   }
  // }, [fetchProgram.data]);

  // const handleGenerateUserKey = async (
  //   seed: string
  // ): Promise<string | undefined> => {
  //   try {
  //     await nillion.default();
  //     const userkey = seed
  //       ? nillion.UserKey.from_seed(seed)
  //       : nillion.UserKey.generate();
  //     const userkey_base58 = userkey.to_base58();
  //     setUserId(userkey_base58);
  //   } catch (error) {
  //     console.error(error, "Error generating user key");
  //     return undefined;
  //   }
  // };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full gap-5">
      <div className="flex gap-2 items-center">
        {/* <Button
          onClick={() => handleGenerateUserKey("nillion-devnet-participant")}
        >
          Generate User ID
        </Button> */}
        {/* <Button onClick={handleStoreProgram}>Store Program</Button> */}
        {/* <Button onClick={handleUseProgram}>Compute</Button> */}
      </div>

      <div className="flex justify-center items-center">
        {userId && (
          <div>
            <div>User ID: {userId}</div>
          </div>
        )}
      </div>
      {/* <div>
        {computeResult && (
          <div>
            <div>Compute Result: {computeResult}</div>
          </div>
        )}
      </div> */}
    </div>
  );
}
