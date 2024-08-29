import {useContext} from "react";
import {GlobalContext} from "./GlobalContext";

const useGlobalContextHook = () => {
  return useContext(GlobalContext);
};

export default useGlobalContextHook;
