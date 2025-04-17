import { DatavError } from "@/domains/error";
import { getCurrentInstance } from "vue";
import {JSONPath} from 'jsonpath-plus';

export interface FilterConfig {
  id: number;
  enabled: boolean;
}

export interface DataFilter {
  id: number;
  name: string;
  code: string;
  origin: string;
  projectId: number;
  createAt: string;
  updateAt: string;
}

export function execFilter(dataFilters: DataFilter[], filterConfigs: FilterConfig[], data: any) {
  if (dataFilters.length && filterConfigs && filterConfigs.length) {
    let res = data;
    let targetId = 0;
    try {
      filterConfigs.forEach(({ id, enabled }) => {
        if (enabled) {
          const df = dataFilters.find(m => m.id === id);
          if (df) {
            targetId = id;
            const func = new Function("data,SUM,AVG,MAX,MIN,JSONPath", df.code);
            res = func(res, SUM, AVG, MAX, MIN, JSONPath);
          }
        }
      });
    } catch (error) {
      throw new DatavError("过滤器执行错误", error.toString(), {
        targetId,
        origin: error
      });
    }

    return res;
  }

  return data;
}

const SUM = (list: any[], key?: string) => {
  if (list.length == 0) {
    return 0;
  }
  if (key) {
    return list.reduce((pre, cur) => pre + cur[key], 0);
  } else {
    return list.reduce((pre, cur) => pre + cur, 0);
  }
};

const AVG = (list: any[], key?: string) => {
  if (list.length == 0) {
    return 0;
  }
  if (key) {
    return list.reduce((pre, cur) => pre + cur[key], 0) / list.length;
  } else {
    return list.reduce((pre, cur) => pre + cur, 0) / list.length;
  }
};

const MAX = (list: any[], key?: string) => {
  if (list.length == 0) {
    return 0;
  }
  if (key) {
    return list.reduce((pre, cur) => {
      return pre > cur[key] ? pre : cur[key];
    }, list[0][key]);
  } else {
    return list.reduce((pre, cur) => {
      return pre > cur ? pre : cur;
    }, list[0]);
  }
};

const MIN = (list: any[], key?: string) => {
  if (list.length == 0) {
    return 0;
  }
  if (key) {
    return list.reduce((pre, cur) => {
      return pre < cur[key] ? pre : cur[key];
    }, list[0][key]);
  } else {
    return list.reduce((pre, cur) => {
      return pre < cur ? pre : cur;
    }, list[0]);
  }
};
