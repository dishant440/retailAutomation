import { useContext } from "react";
import { RouterContext } from "../Store/router";

export default function useRouter() {
  return useContext(RouterContext);
}
