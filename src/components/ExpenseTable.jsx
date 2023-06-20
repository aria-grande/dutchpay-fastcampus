import { Table } from "react-bootstrap"
import { useRecoilValue, useSetRecoilState } from "recoil"
import styled from "styled-components"
import { currencyState } from "../state/currency"
import { expensesState } from "../state/expenses"
import { getDescriptiveAmount } from "../util"
import { OverlayWrapper } from "./shared/OverlayWrapper"
import {API} from "aws-amplify"
import {groupIdState} from "../state/groupId"
import {TrashFill} from "react-bootstrap-icons"
export const ExpenseTable = () => {
  const guid = useRecoilValue(groupIdState)
  const expenses = useRecoilValue(expensesState)
  const currency = useRecoilValue(currencyState)
  const setExpense = useSetRecoilState(expensesState)

  const deleteExpense = (expenseIdx) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("해당 비용을 정말 삭제 하시겠습니까?")) {
      return ;
    }
    const newExpenses = expenses.filter((_, idx) => idx !== expenseIdx)

    API.put('groupsApi', `/groups/${guid}/expenses/replace`, {
      body: {
        expenses: newExpenses
      }
    })
        .then(_response => {
          setExpense(expenses => newExpenses)
        })
        .catch(_error => {
          alert("비용 삭제에 실패 했습니다. 다시 시도해 주세요.")
        })
  }

  return (
    <OverlayWrapper minHeight={"73vh"}>
      <StyledTable data-testid="expenseList" borderless hover responsive>
        <StyledThead>
          <tr>
            <th>날짜</th>
            <th>내용</th>
            <th>결제자</th>
            <th>금액</th>
            <th></th>
          </tr>
        </StyledThead>
        <StyledBody>
        {expenses.map(({date, desc, amount, payer}, idx) => (
          <tr key={`expense-${idx}`}>
            <td>{date}</td>
            <td>{desc}</td>
            <td>{payer}</td>
            <td>{getDescriptiveAmount(currency, amount)}</td>
            <td>
              <StyledAnchor onClick={() => deleteExpense(idx)}>
                <TrashFill/>
              </StyledAnchor>
            </td>
          </tr>
        ))}
        </StyledBody>
      </StyledTable>
    </OverlayWrapper>
  )
}

const StyledAnchor = styled.a`
  cursor: pointer;
  color: dimgray;
  &:hover {
    color: indianred;
  }
`

const StyledTable = styled(Table)`
  min-width: 450px;
  @media screen and (max-width: 600px) {
    min-width: 300px;
  }
`

const StyledThead = styled.thead`
  color: #6B3DA6;
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  line-height: 25px;
  th {
    padding: 15px 8px;
    min-width: 60px;
  }
  @media screen and (max-width: 600px) {
    font-size: 4vw;
    line-height: 10px;
    th {
      padding: 10px 4px;
    }
  }
`

const StyledBody = styled.tbody`
  td {
    font-weight: 400;
    font-size: 20px;
    line-height: 50px;
    text-align: center;

    @media screen and (max-width: 600px) {
      font-size: 4vw;
      line-height: 20px;
    }
  }

`