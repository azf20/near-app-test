/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. sayGm: say "gm"
 * 2. getGreeter: find out the last account to say "gm"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/roles/developer/contracts/assemblyscript
 *
 */

import { Context, logging, storage } from "near-sdk-as";

export function // Exported functions will be part of the public interface for your smart contract.

getGreeter(): string | null {
  // This uses raw `storage.get`, a low-level way to interact with on-chain
  // storage for simple contracts.
  // If you have something more complex, check out persistent collections:
  // https://docs.near.org/docs/roles/developer/contracts/assemblyscript#imports
  return storage.getString("Greeter");
}

export function sayGm(): void {
  const account_id = Context.sender;

  logging.log('{"greeter": "' + account_id + '"}');

  storage.set("Greeter", account_id);
}
