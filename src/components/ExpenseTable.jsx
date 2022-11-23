import { Table } from "react-bootstrap"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { expensesState } from "../state/expenses"
import { OverlayWrapper } from "./shared/OverlayWrapper"

export const ExpenseTable = () => {
  const expenses = useRecoilValue(expensesState)
  return (
    <OverlayWrapper minHeight={"73vh"}>
      <StyledTable data-testid="expenseList" borderless hover responsive>
        <StyledThead>
          <tr>
            <th>날짜</th>
            <th>내용</th>
            <th>결제자</th>
            <th>금액</th>
          </tr>
        </StyledThead>
        <StyledBody>
        {expenses.map(({date, desc, amount, payer}, idx) => (
          <tr key={`expense-${idx}`}>
            <td>{date}</td>
            <td>{desc}</td>
            <td>{payer}</td>
            <td>{parseInt(amount)} 원</td>
          </tr>
        ))}
        </StyledBody>
      </StyledTable>
    </OverlayWrapper>
  )
}

const StyledTable = styled(Table)`
  min-width: 450px;
`

const StyledThead = styled.thead`
  color: #6B3DA6;
  text-align: center;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;

  th {
    padding: 20px 8px;
  }

`

const StyledBody = styled.tbody`
  td {
    font-weight: 400;
    font-size: 24px;
    line-height: 59px;
  }

`