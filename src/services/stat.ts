import axios, { ResDataType } from "./ajax"

// 获取问卷的统计列表
export async function getQuestionStatListService(
  questionId: string,
  opt: { page: number; pageSize: number }
): Promise<ResDataType> {
  const url = `/api/stat/${questionId}`
  const data = (await axios.get(url, { params: opt })) as ResDataType
  return data
}

// 获取组件统计数据汇总
export async function getComponentStatService(
  questionId: string,
  componentFeId: string
): Promise<ResDataType> {
  const url = `/api/stat/${questionId}/${componentFeId}`
  const data = (await axios.get(url)) as ResDataType
  return data
}
