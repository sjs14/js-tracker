/**
 * @uuid 唯一值，用于uv
 * @requestUrl 接口地址
 * @historyTracker 是否history上报
 * @hashTracker 是否hash上报
 * @domTracker 是否对携带Tracker-key的dom，点击事件上报
 * @jsError 是否js和promise报错上报
 * @sdkVersion sdk版本号
 * @extra 透传字段
 */
export interface DefaultOptions {
  uuid: string | undefined;
  requestUrl: string;
  historyTracker: boolean | undefined;
  hashTracker: boolean | undefined;
  domTracker: boolean | undefined;
  jsError: boolean;
  sdkVersion: string | number | undefined;
  extra: Record<string, any> | undefined;
}

export interface Options extends Partial<DefaultOptions> {
  requestUrl: string;
}

// 枚举常亮
export enum TrackerConfig {
  version = "1.0.0",
}
