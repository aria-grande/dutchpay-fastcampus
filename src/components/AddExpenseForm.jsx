import { useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { groupMembersState } from "../state/groupMembers"
import { expensesState } from "../state/expenses"
import styled from "styled-components"
import { API } from "aws-amplify"
import { groupIdState } from "../state/groupId"

export const AddExpenseForm = () => {
  const members = useRecoilValue(groupMembersState)
  const guid = useRecoilValue(groupIdState)

  const today = new Date()
  const [date, setDate] = useState([today.getFullYear(), today.getMonth() + 1, `0${today.getDate()}`.slice(-2)].join("-"))
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState(undefined)
  const [payer, setPayer] = useState(null)
  const [validated, setValidated] = useState(false)

  const [isDescValid, setIsDescValid] = useState(false)
  const [isPayerValid, setIsPayerValid] = useState(false)
  const [isAmountValid, setIsAmountValid] = useState(false)

  const setExpense = useSetRecoilState(expensesState)

  const checkValidity = () => {
    const descValid = desc.length > 0
    const payerValid = payer !== null
    const amountValid = !!amount && amount > 0

    setIsDescValid(descValid)
    setIsPayerValid(payerValid)
    setIsAmountValid(amountValid)

    return descValid && payerValid && amountValid
  }

  const saveExpense = (expense) => {
    API.put('groupsApi', `/groups/${guid}/expenses`, {
      body: {
        expense
      }
    })
      .then(_response => {
        setExpense(expenses => [
          ...expenses,
          expense,
        ])
      })
      .catch(_error => {
        alert("비용 추가에 실패 했습니다. 다시 시도해 주세요.")
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (checkValidity()) {
      const newExpense = {
        date,
        desc,
        amount,
        payer,
      }
      saveExpense(newExpense)
    }
    setValidated(true)
  }

  return (
    <StyledWrapper>
      <Form noValidate onSubmit={handleSubmit}>
        <StyledTitle>1. 비용 추가하기</StyledTitle>
        <Row>
          <Col xs={12}>
            <StyledFormGroup>
              <Form.Control
                type="date"
                placeholder="결제한 날짜를 선택해 주세요"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <StyledFormGroup>
              <Form.Control
                type="text"
                isInvalid={!isDescValid && validated}
                isValid={isDescValid}
                placeholder="비용에 대한 설명을 입력해 주세요"
                value={desc}
                onChange={({target}) => setDesc(target.value)}
              />
              <Form.Control.Feedback
                type="invalid"
                data-valid={isDescValid}
              >
                비용 내용을 입력해 주셔야 합니다.
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6}>
            <StyledFormGroup>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="비용은 얼마였나요?"
                min="0"
                value={amount}
                isInvalid={!isAmountValid && validated}
                isValid={isAmountValid}
                onChange={({target}) => setAmount(target.value)}
              />
              <Form.Control.Feedback
                data-valid={isAmountValid}
                type="invalid"
              >
                1원 이상의 금액을 입력해 주셔야 합니다.</Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col xs={12} lg={6}>
            <StyledFormGroup>
              <Form.Select
                isValid={isPayerValid}
                isInvalid={!isPayerValid && validated}
                defaultValue=""
                className="form-control"
                onChange={({target}) => setPayer(target.value)}
              >
                <option disabled value="">누가 결제 했나요?</option>
                {members && members.map(member =>
                  <option key={member} value={member}>{member}</option>
                )}
              </Form.Select>
              <Form.Control.Feedback
                data-valid={isPayerValid}
                type="invalid"
              >결제자를 선택해 주셔야 합니다.</Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="d-grid gap-2">
            <StyledSubmitButton>추가하기</StyledSubmitButton>
          </Col>
        </Row>
      </Form>
      </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  padding: 40px;
  background-color: #683BA1;
  box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
`

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 15px;

  input, select {
    background: #59359A;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    border: 0;
    color: #F8F9FA;
    height: 40px;

    &:focus {
      color: #F8F9FA;
      background: #59359A;
      filter: brightness(80%);
    }

    ::placeholder {
      color: #F8F9FA;
    }
  }
`
export const StyledTitle = styled.h3`
  color: #FFFBFB;
  text-align: center;
  font-weight: 700;
  font-size: 25px;
  line-height: 30px;
  letter-spacing: 0.25px;
  margin-bottom: 15px;
  @media screen and (max-width: 600px) {
    font-size: 5.5vw;
    line-height: 6vw;
  }
`
const StyledSubmitButton = styled(Button).attrs({
  type: 'submit'
})`
  height: 45px;
  border: 0px;
  border-radius: 8px;
  background-color: #E2D9F3;
  color: #59359A;
  margin-top: 10px;

  &:hover, &:focus {
    background-color: #E2D9F3;
    filter: rgba(0,0,0,0.3);
  }
`