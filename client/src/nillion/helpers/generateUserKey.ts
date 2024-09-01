// import * as nillion from "@nillion/client-web";

// export const handleGenerateUserKey = async (seed: string): Promise<string | undefined> => {
//   try {
//     await nillion.default();
//     const userkey = seed
//       ? nillion.UserKey.from_seed(seed)
//       : nillion.UserKey.generate();
//     const userkey_base58 = userkey.to_base58();
//     return userkey_base58;
//   } catch (error) {
//     console.error(error, "Error generating user key");
//     return undefined;
//   }
// };