/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/roles/developer/contracts/assemblyscript
 *
 */

import { Context, logging, storage } from "near-sdk-as";

const DEFAULT_MESSAGE = "Hello";

let GLOBAL_MESSAGE = "Hello everyone";

@nearBindgen
class MessageChange {
  constructor(
    public oldMessage: string,
    public newMessage: string,
    public changer: string
  ) {}
}

// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
export function getGreeting(accountId: string): string | null {
  // This uses raw `storage.get`, a low-level way to interact with on-chain
  // storage for simple contracts.
  // If you have something more complex, check out persistent collections:
  // https://docs.near.org/docs/roles/developer/contracts/assemblyscript#imports
  return storage.get<string>(accountId, DEFAULT_MESSAGE);
}

// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
export function getGlobalGreeting(): string | null {
  return storage.get<string>("GLOBAL", GLOBAL_MESSAGE);
}

export function setGreeting(message: string): void {
  const account_id = Context.sender;

  // Use logging.log to record logs permanently to the blockchain!
  logging.log(
    // String interpolation (`like ${this}`) is a work in progress:
    // https://github.com/AssemblyScript/assemblyscript/pull/1115
    'Saving greeting "' + message + '" for account "' + account_id + '"'
  );

  storage.set(account_id, message);
}

export function setGlobalGreeting(message: string): MessageChange {
  const account_id = Context.sender;
  const old_message = getGlobalGreeting();

  storage.set("GLOBAL", message);

  logging.log(
    // String interpolation (`like ${this}`) is a work in progress:
    // https://github.com/AssemblyScript/assemblyscript/pull/1115
    account_id +
      'changed the global greeting from "' +
      old_message! +
      '" to "' +
      message
  );

  const messageChange = new MessageChange(old_message!, message, account_id);

  return messageChange;
}
