import { InputTags } from "react-bootstrap-tagsinput"
import { useRecoilState, useRecoilValue } from "recoil"
import { CenteredOverlayForm } from "./shared/CenteredOverlayForm"
import { groupMembersState } from "../state/groupMembers"
import { useState } from "react"
import { groupNameState } from "../state/groupName"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../routes"
import styled from "styled-components"
import { Form } from "react-bootstrap"

export const AddMembers = () => {
  const [groupMembers, setGroupMembers] = useRecoilState(groupMembersState)
  const groupName = useRecoilValue(groupNameState)
  const [groupMembersString, setGroupMembersString] = useState('')
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    setValidated(true)
    if (groupMembers.length > 0) {
      navigate(ROUTES.EXPENSE_MAIN)
    } else if (isSamsungInternet && groupMembersString.length > 0) {
      setGroupMembers(groupMembersString.split(','))
    }
  }

  const isSamsungInternet = window.navigator.userAgent.includes('SAMSUNG')

  const header = `${groupName} 그룹에 속한 사람들의 이름을 모두 적어 주세요.`

  return (
    <CenteredOverlayForm
      title={header}
      validated={validated}
      handleSubmit={handleSubmit}
    >
      { isSamsungInternet ?
          <Form.Control
          placeholder="이름 간 컴마(,)로 구분"
          onChange={({target}) => setGroupMembersString(target.value)}
        />
     :
        <InputTags
            data-testid="input-member-names"
            placeholder="이름 간 띄어 쓰기"
            onTags={(value) => setGroupMembers(value.values)}
          />
      } 
      {validated && groupMembers.length === 0 && (
        <StyledErrorMessage>그룹 멤버들의 이름을 입력해 주세요.</StyledErrorMessage>
      )}
    </CenteredOverlayForm>
  )
}

const StyledErrorMessage = styled.span`
  color: red;
`