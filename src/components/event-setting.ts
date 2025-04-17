import * as handleJson from "@/../public/templates/handleList.json";
import * as ichandleJson from "@/../public/templates/ichandleList.json";
import * as uetypeJson from "@/../public/templates/uetype.json";
import * as specialJson from "@/../public/templates/special.json";
import * as specialspeedJson from "@/../public/templates/specialspeed.json";
import { HandleItemConfig, IcHandleItemConfig } from "./data-handle";

export interface eventSetting {
  component: string;
  actions: {
    methodCode: string;
    methodName: string;
    hasParams: boolean;
    hasScript: boolean;
  }[];
  events: {
    name: string;
    title: string;
  }[];
}

export interface icEventSetting {
  component: string;
  icevents: {
    name: string;
    title: string;
    properties?: IcItemProperty[];
    events?: IcItemEvent[];
  }[];
}

export interface IcItemProperty {
  name: string;
  path: string;
  type: string;
}

export interface IcItemEvent {
  methodCode: string;
  methodName: string;
}

export interface uetypeSetting {
  name: string;
  type: string;
}

export interface specialSetting {
  name: string;
  type: string;
}

export function getAllEventSetting() {
  const jsonlist = (handleJson.default as unknown) as eventSetting[];
  return jsonlist;
}

export function getAllIcEventSetting() {
  const jsonlist = (ichandleJson.default as unknown) as icEventSetting[];
  return jsonlist;
}

export function getAllUeTypes() {
  const uetypelist = (uetypeJson.default as unknown) as uetypeSetting[];
  return uetypelist;
}

export function getAllSpecialTypes() {
  const speciallist = (specialJson.default as unknown) as specialSetting[];
  return speciallist;
}

export function getAllSpecialSpeedTypes() {
  const specialspeedlist = (specialspeedJson.default as unknown) as specialSetting[];
  return specialspeedlist;
}

export function getEventSettingBy(componentName: string) {
  const settings = getAllEventSetting();
  return settings.find(r => r.component == componentName);
}

export function getIcEventSettingBy(componentName: string) {
  const settings = getAllIcEventSetting();
  return settings.find(r => r.component == componentName);
}

export function getInitHandleConfig(componentName: string) {
  const setting = getEventSettingBy(componentName);
  const list: Record<string, HandleItemConfig> = {};

  if (setting) {
    setting.events.forEach(r => {
      list[r.name] = { eventName: r.name, description: r.title, fields: [] };
      //  ({ eventName: r.name, description: r.title, fields: [] })
    });
  }

  return list;
}

export function getInitIcHandleConfig(componentName: string) {
  const setting = getIcEventSettingBy(componentName);
  const list: Record<string, IcHandleItemConfig> = {};

  if (setting) {
    setting.icevents.forEach(r => {
      list[r.name] = {
        eventName: r.name,
        description: r.title,
        fields: [],
        properties: r.properties,
        events: r.events
      };
    });
  }

  return list;
}
