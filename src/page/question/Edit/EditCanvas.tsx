import React, { FC, MouseEvent } from "react"
import { Spin } from "antd"
import { useDispatch } from "react-redux"
import classNames from "classnames"
import useGetComponentInfo from "../../../hooks/useGetComponentInfo"
import { getComponentConfByType } from "../../../components/QuestionComponents"
import {
  ComponentInfoType,
  changeSelectedId,
  moveComponent,
} from "../../../store/componentsReducer"
import useBindCanvasKeyPress from "../../../hooks/useBindCanvasKeyPress"
import SortableContainer from "../../../components/DragSortable/SortableContainer"
import SortableItem from "../../../components/DragSortable/SortableItem"
import styles from "./EditCanvas.module.scss"

// 临时引入静态
// import QuestionTitle from "../../../components/QuestionComponents/QuestionTitle/Component"
// import QuestionInput from "../../../components/QuestionComponents/QuestionInput/Component"

type PropsType = {
  loading: boolean
}
// 生成组件
function genComponent(componentInfo: ComponentInfoType) {
  const { type, props } = componentInfo //每个组件的信息，从redux store获取（服务端获取）
  const componentConf = getComponentConfByType(type)
  if (componentConf == null) return null

  const { Component } = componentConf
  return <Component {...props} />
}

const EditCanvas: FC<PropsType> = ({ loading }) => {
  // 获取组件信息
  const { componentList, selectedId } = useGetComponentInfo()

  const dispatch = useDispatch()

  // 选中组件
  function handleClick(event: MouseEvent, id: string) {
    // event.preventDefault阻止默认行为
    event.stopPropagation() // 阻止冒泡
    dispatch(changeSelectedId(id))
  }

  // 绑定键盘快捷键
  useBindCanvasKeyPress()

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Spin />
      </div>
    )
  }

  // SortableContainer的组件的items属性，需要每个items都有id，给组件添加id
  const componentListWithId = componentList.map(c => {
    return { ...c, id: c.fe_id }
  })

  // 拖拽排序结束
  function handleDragEnd(oldIndex: number, newIndex: number) {
    dispatch(moveComponent({ oldIndex, newIndex }))
  }

  return (
    <SortableContainer items={componentListWithId} onDragEnd={handleDragEnd}>
      <div className={styles.canvas}>
        {componentList
          .filter(c => !c.isHidden)
          .map(c => {
            const { fe_id, isLocked } = c

            // 拼接class name
            const wrapperDefaultClassName = styles["component-wrapper"]
            const selectedClassName = styles.selected
            const lockedClassName = styles.locked
            const wrapperClassName = classNames({
              [wrapperDefaultClassName]: true,
              [selectedClassName]: fe_id === selectedId,
              [lockedClassName]: isLocked,
            })

            return (
              <SortableItem key={fe_id} id={fe_id}>
                <div className={wrapperClassName} onClick={e => handleClick(e, fe_id)}>
                  <div className={styles.component}>{genComponent(c)}</div>
                </div>
              </SortableItem>
            )
          })}
        {/* <div className={styles["component-wrapper"]}>
      <div className={styles.component}>
        <QuestionTitle />
      </div>
    </div>
    <div className={styles["component-wrapper"]}>
      <div className={styles.component}>
        <QuestionInput />
      </div>
    </div> */}
      </div>
    </SortableContainer>
  )
}

export default EditCanvas
