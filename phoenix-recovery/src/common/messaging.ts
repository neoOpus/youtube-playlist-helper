/**
 * Phoenix Message Bus v1.0
 * Typed communication for Chrome Extensions
 */

export type PhoenixMessage =
  | { type: 'SAVE_ENTRY'; data: { fieldId: string; value: string; url: string; fieldName: string; fieldType: string } }
  | { type: 'MARK_SUBMITTED'; data: { payload: string } }
  | { type: 'GET_HISTORY'; data: { fieldId: string } };

export const PhoenixBus = {
  send: (msg: PhoenixMessage) => chrome.runtime.sendMessage(msg),
  on: (callback: (msg: PhoenixMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => void) => {
    chrome.runtime.onMessage.addListener(callback);
  }
};
