import {Button} from "@/components/ui/button";

import {
  useFetchProgramOutput,
  useNillion,
  useRunProgram,
  useStoreProgram,
  useStoreValue,
} from "@nillion/client-react-hooks";
import {useEffect, useState} from "react";
// import {handleGenerateUserKey} from "@/nillion/helpers/generateUserKey";
import * as nillion from "@nillion/client-web";
import {transformNadaProgramToUint8Array} from "@/nillion/helpers/nadaToUint";
import {
  Permissions,
  ProgramId,
  NadaValue,
  NadaValues,
  NamedValue,
  PartyId,
  PartyName,
  ProgramBindings,
} from "@nillion/client-core";

// const myFeedback =

export default function Organiser() {
  // nillion -----

  // const [selectedProgramCode, setSelectedProgramCode] = useState("");
  // const [programID, setProgramID] = useState<string | undefined>(undefined);
  // const [computeID, setComputeID] = useState<any | null>(null);
  // const [computeResult, setComputeResult] = useState<any | null>(null);

  // const client = useNillion();
  // const storeProgram = useStoreProgram();
  // const storeValue = useStoreValue();
  // const runProgram = useRunProgram();
  // const fetchProgram = useFetchProgramOutput({
  //   id: computeID,
  // });

  // const PROGRAM_NAME = "compute_carbon_score";

  // useEffect(() => {
  //   if (client.ready) {
  //     console.log(client.vm.userId, "client.vm.userId");
  //   }
  // }, [client]);
  // // Fetch Nada Program Code.
  // useEffect(() => {
  //   const fetchProgramCode = async () => {
  //     const response = await fetch(`/programs/compute_carbon_score.py`);
  //     const text = await response.text();

  //     console.log("text", text);

  //     setSelectedProgramCode(text);
  //   };
  //   fetchProgramCode();
  // }, [selectedProgramCode]);

  // const handleStoreProgram = async () => {
  //   try {
  //     const programBinary = await transformNadaProgramToUint8Array(
  //       `/programs/${PROGRAM_NAME}.nada.bin`
  //     );

  //     console.log("programBinary", programBinary);
  //     const result = await storeProgram.mutateAsync({
  //       name: PROGRAM_NAME,
  //       program: programBinary,
  //     });
  //     setProgramID(result!);
  //   } catch (error) {
  //     console.log("error in storing program", error);
  //   }
  // };

  // // Action to store Program with Nada

  // const registerFeedback1 = async (feedbackNumber: number) => {
  //   try {
  //     if (programID === undefined) throw new Error("Program ID is undefined");

  //     const permissions = Permissions.create().allowCompute(
  //       client.vm.userId,
  //       programID as ProgramId
  //     );

  //     const result = await storeValue.mutateAsync({
  //       values: {
  //         feedback: feedbackNumber,
  //       },
  //       ttl: 3600,
  //       permissions,
  //     });

  //     // console.log("result", result);
  //   } catch (error) {
  //     console.error("Error storing SecretInteger:", error);
  //   }
  // };

  // const registerFeedback2 = async (feedbackNumber: number) => {
  //   try {
  //     if (programID === undefined) throw new Error("Program ID is undefined");

  //     const permissions = Permissions.create().allowCompute(
  //       client.vm.userId,
  //       programID as ProgramId
  //     );

  //     const result = await storeValue.mutateAsync({
  //       values: {
  //         feedback: feedbackNumber,
  //       },
  //       ttl: 3600,
  //       permissions,
  //     });
  //   } catch (error) {
  //     console.error("Error storing SecretInteger:", error);
  //   }
  // };

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

  // const handleUseProgram = async () => {
  //   try {
  //     // Bindings
  //     const bindings = ProgramBindings.create(programID!);
  //     bindings.addInputParty(
  //       "Party1" as PartyName,
  //       client.vm.partyId as PartyId
  //     );
  //     bindings.addOutputParty(
  //       "Party1" as PartyName,
  //       client.vm.partyId as PartyId
  //     );

  //     // const feedbackBlob = new TextEncoder().encode(JSON.stringify(myFeedback));
  //     const values = NadaValues.create()
  //       .insert(NamedValue.parse("feedback1"), NadaValue.createSecretInteger(7))
  //       .insert(
  //         NamedValue.parse("feedback2"),
  //         NadaValue.createSecretInteger(4)
  //       );

  //     const res = await runProgram.mutateAsync({
  //       bindings: bindings,
  //       values,
  //       storeIds: [],
  //     });

  //     console.log("fucku", res);

  //     setComputeID(res);
  //   } catch (error) {
  //     console.error("Error executing program:", error);
  //     throw error;
  //   }
  // };

  // useEffect(() => {
  //   if (fetchProgram.data) {
  //     console.log(fetchProgram.data, "fetchProgram.data");
  //     // @ts-ignore
  //     setComputeResult(fetchProgram.data.total_feedback.toString());
  //   }
  // }, [fetchProgram.data]);

  // nillion -----

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full gap-5">
      <div>
        {/* {loggedInAddress && balanceAddress && (
          <div>
            <div>Logged in as: {loggedInAddress}</div>
            <div>Balance: {balanceAddress}</div>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <Button onClick={login}>Login</Button>
        <Button onClick={logout}>Logout</Button>
      </div> */}

        {/* <div className="max-w-lg">
        {programID && <p>Program ID: {JSON.stringify(programID, null, 2)}</p>}
      </div> */}

        {/* {computeResult && (
        <div>
          <div>Compute Result: {computeResult}</div>
        </div>
      )}
      <div className="flex gap-2 items-center">
        {/* <Button
          onClick={() => handleGenerateUserKey("nillion-devnet-organiser")}
        >
          Generate User ID
        </Button> 
        <Button onClick={handleStoreProgram}>Store Program</Button>
        <Button onClick={() => registerFeedback1(7)}>Store Feedback 1</Button>
        <Button onClick={() => registerFeedback2(4)}>Store Feedback 2</Button>
        <Button onClick={handleUseProgram}>Compute</Button> */}
      </div>
    </div>
  );
}
