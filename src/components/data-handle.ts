export interface HandleItemConfig {
  eventName: string; //事件名称，例如：click、mouseEnter
  description?: string; //事件描述，例如：点击，鼠标移入
  fields: HandleItemField[]; //关联的目标组件
  lastTargetName?: string;
}

export interface HandleItemField {
  name: string; //随机生成的名称，naiveUI中的collapse控件需要用到
  targetComId?: string;
  targetComAlias?: string;
  targetMethodName?: string;
  targetMethodTitle?: string;
  hasParams?: boolean;
  hasScript?: boolean;
  script?: string;
  params?: string;
  showDeleteConfirm: boolean;
  uetype?: string; //接收飘视底图事件代码
  value?: any;
  special?: string; //特效
  specialTimer?: number; //特效持续时间
  specialType?: string; //特效显示方式
  specialParams?: string; //自定义特效编码 未使用，待定
  hasDecideScript?: boolean;
  decideScript?: string;
}

export interface IcHandleItemConfig {
  eventName: string; //事件名称，例如：click、mouseEnter
  description?: string; //事件描述，例如：点击，鼠标移入
  fields: IcHandleItemField[]; //关联的目标组件
  lastTargetName?: string;
  properties?: IcItemProperty[];
  events?: IcItemEvent[];
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

export interface IcHandleItemField {
  name: string; //随机生成的名称，naiveUI中的collapse控件需要用到

  targetComId?: string;
  targetComAlias?: string;

  targetMethodName?: string; //事件code
  targetMethodTitle?: string; //事件名称
  targetProperty?: string; //属性路径
  targetPropertyTitle?: string; //属性名称
  targetPropertyType?: string; //属性类型

  targetMethodTriggle?: string; //触发类型

  association?: string; //关联对象 formula pt

  icName?: string; //点位名称
  icDevice?: string; //点位设备名称
  pt?: PtModel; //点位模型

  formula?: FormulaSecModel; //配方模型
  formulaName?: string; //配方集名称
  formulaId?: number; //配方id
  seq?: number; //配方集id

  hasParams?: boolean;
  hasScript?: boolean;
  script?: string;
  params?: string;

  showDeleteConfirm: boolean;
  bindType?: string;
  value?: any;
  operator?: string; //逻辑运算符
  opvalue?: string; //逻辑对比值

  operator2?: string; //闭区间逻辑运算符
  opvalue2?: string; //闭区间逻辑对比值

  opresult?: any; //组件赋值
  special?: string; //特效
  specialTimer?: number; //特效持续时间
  specialType?: string; //特效显示方式
  specialParams?: string; //自定义特效编码 未使用，待定
  hasDecideScript?: boolean;
  decideScript?: string;

  targetMethodAuthType?:string //触发类型操作 权限类型
  targetMethodAuthUsers?:any[] //允许操作的人员
  targetMethodAuthRoles?:any[] //允许操作的角色
}

//点位模型
export interface PtModel {
  device: string; //所属设备
  instanceName: string;
  instanceType: string;
  propertyName: string; //点位名称
  propertyShowName: string;
  description: string;
  extension: any; //附加属性
  value?: any; //点位值 预留
  virtual: boolean;
  nodeType: string;
  ideExtension?:any //ide属性
}

//点位组件中的点位模型 包含事件部分
export interface PtEventModel {
  device: string; //所属设备
  instanceName: string;
  instanceType: string;
  propertyName: string; //点位名称
  description: string;
  extension: any; //附加属性
  value?: any; //点位值 预留
  fields?: IcHandleItemField[];
  virtual: boolean;
}

//配方集模型
export interface FormulaSecModel {
  id?: number;
  deviceCode: string;
  nodeCode: string;
  name: string;
  seq?: number;
  formulaId?: number;
  showName: string;
  defaultValue: string;
  description: string;
}
