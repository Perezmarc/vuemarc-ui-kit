// export function getFocusedElementId() {
//   return document.activeElement && document.activeElement.id;
// }
// export function getFocusedTabIndex(tabs = []) {
//   let activeId = getFocusedElementId();
//   let tabIndex = tabs.findIndex((tab: any) => tab.tabId === activeId);
//   return tabIndex;
// }
// export function findElementAndFocus(elemId: any) {
//   let elem = document.getElementById(elemId);
//   elem && elem.focus();
// }
export function isPromise(func: any) {
  return func.then && typeof func.then === "function";
}
