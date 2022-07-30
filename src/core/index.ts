import { DefaultOptions, Options, TrackerConfig } from "../typings/index";
import { createHistoryEvent } from "../utils/pv";

const MouseEventList: string[] = [
  "click",
  "dblclick",
  "contextmenu",
  "mousedown",
  "mouseup",
  "mouseenter",
  "mouseout",
  "mouseover",
];

export default class JsTracker {
  public data: Options;
  constructor(options: Options) {
    this.data = Object.assign(this.initDef(), options);
    this.initTracker();
  }

  private initDef(): DefaultOptions {
    this.rewriteHistoryFn();
    return <DefaultOptions>{
      sdkVersion: TrackerConfig.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false,
    };
  }

  setUserId<T extends DefaultOptions["uuid"]>(uuid: T) {
    this.data.uuid = uuid;
  }

  setExtra<T extends DefaultOptions["extra"]>(extra: T) {
    this.data.extra = extra;
  }

  setTracker<T>(data: T) {
    this.reportTracker(data);
  }

  rewriteHistoryFn() {
    window.history["pushState"] = createHistoryEvent("pushState");
    window.history["replaceState"] = createHistoryEvent("replaceState");
  }

  private captureEvents<T>(
    mounseEvents: string[],
    targetKey: string,
    data?: T
  ) {
    mounseEvents.forEach((event) => {
      window.addEventListener(event, () => {
        console.log(`接收到了${event}事件`);
        this.reportTracker({
          event,
          targetKey,
          data,
        });
      });
    });
  }

  private targetKeyReport() {
    MouseEventList.forEach((ev) => {
      window.addEventListener(ev, (e) => {
        const target = e.target as HTMLElement;

        const trackerKey = target.getAttribute("tracker-key");

        if (!trackerKey) return;

        this.reportTracker({
          event: ev,
          trackerKey,
        });
      });
    });
  }

  private initTracker() {
    if (this.data.historyTracker) {
      this.captureEvents(
        ["popstate", "pushState", "replaceState"],
        "history-pv"
      );
    }

    if (this.data.hashTracker) {
      this.captureEvents(["hashchange"], "hash-pv");
    }

    if (this.data.domTracker) {
      this.targetKeyReport();
    }

    
  }

  private reportTracker<T>(data: T) {
    const params = Object.assign(this.data, data, {
      time: new Date().getTime(),
    });

    const headers = {
      type: "application/x-www-form-urlencoded",
    };
    let blob = new Blob([JSON.stringify(params)], headers);
    navigator.sendBeacon(this.data.requestUrl, blob);
  }
}
