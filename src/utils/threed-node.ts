export enum NodeDataType {
    number,
    string,
    boolean
}

export const convertNodeTypeToDataType = (nodeType:string) =>{

  if(!nodeType)
  {
    return null
  }

  switch(nodeType.toLocaleLowerCase())
  {
    case 'int16':
    case 'uint16':
    case 'int32':
    case 'uint32':
    case 'int64':
    case 'uint64':
    case 'float':
    case 'double':
      return NodeDataType.number
    case 'boolean':
      return NodeDataType.boolean
    default:
      return NodeDataType.string
  }
}


export const getOperatorListByDataType = (dataType:NodeDataType) => {
  switch (dataType)
  {
    case NodeDataType.number:
      return [
        { label: '等于', value: '==' },
        { label: '不等于', value: '!=' },
        { label: '大于', value: '>' },
        { label: '大于等于', value: '>=' },
        { label: '小于', value: '<' },
        { label: '小于等于', value: '<=' },
      ]
    case NodeDataType.boolean:
      return [
        { label: '等于', value: '==' },
        { label: '不等于', value: '!=' },
      ]
    default:
      return [
        { label: '等于', value: '==' },
        { label: '不等于', value: '!=' },
        { label: '包含', value: 'in' },
        { label: '不包含', value: 'not_in' },
        { label: '为空', value: 'is_null' },
        { label: '不为空', value: 'is_not_null' },
      ]
  }
}

export const computeDataType = (dataType:NodeDataType, operator:string, refValue:any, value:any) => {
  switch (dataType)
  {
    case NodeDataType.number:
      const valueNumber = Number(value)
      const refValueNumber = Number(refValue)

      switch(operator)
      {
        case '==':
          return refValueNumber == valueNumber
        case '!=':
          return refValueNumber != valueNumber
        case '>':
          return valueNumber > refValueNumber
        case '>=':
          return valueNumber >= refValueNumber
        case '<':
          return valueNumber < refValueNumber
        case '<=':
          return valueNumber <= refValueNumber
      }
      break
    case NodeDataType.boolean:
      const valueBoolean = Boolean(value)
      const refValueBoolean = Boolean(refValue)

      switch(operator) {
        case '==':
          return refValueBoolean == valueBoolean
        case '!=':
          return refValueBoolean != valueBoolean
      }
      break
    default:
      const valueString = String(value)
      const refValueString = String(refValue)

      switch(operator) {
        case '==':
          return refValueString == valueString
        case '!=':
          return refValueString != valueString
        case 'in':
          return valueString.includes(refValueString)
        case 'not_in':
          return !valueString.includes(refValueString)
        case 'is_null':
          return valueString == null
        case 'is_not_null':
          return valueString != null
      }
      break
  }
}

