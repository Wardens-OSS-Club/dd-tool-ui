import { ethers } from "ethers";

export function parseAbiFunctions(
  abiArray: any[],
  iface: ethers.Interface,
  targetAddress: string
) {
  let i: number = 0;
  return abiArray
    .filter((item) => item.startsWith("function")) // Only keep items that are functions
    .map((funcString) => {
      // Extract the function name and parameters
      const content = funcString.substring(9, funcString.indexOf("(")).trim();
      // We incr the id to assist with unique id gen
      i++;
      // Build and return the object
      return {
        id: (Date.now() + i).toString(), // ID generation logic: timestamp + i
        content,
        functionString: funcString,
        address: targetAddress, // Address should be provided here
        inputs: iface.getFunction(funcString)?.inputs,
      };
    });
}
