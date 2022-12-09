import { Table } from "react-bootstrap"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { currencyState } from "../state/currency"
import { expensesState } from "../state/expenses"
import { getDescriptiveAmount } from "../util"
import { OverlayWrapper } from "./shared/OverlayWrapper"

export const ExpenseTable = () => {
  const expenses = useRecoilValue(expensesState)
  const currency = useRecoilValue(currencyState)

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
            <td>{getDescriptiveAmount(currency, amount)}</td>
          </tr>
        ))}
        </StyledBody>
      </StyledTable>
    </OverlayWrapper>
  )
}

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