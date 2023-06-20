import { API } from "aws-amplify"
import { Form } from "react-bootstrap"
import { useRecoilState, useRecoilValue } from "recoil"
import { currencyCodeState, supportedCurrencies } from "../state/currency"
import { groupIdState } from "../state/groupId"

export const CurrencySetter = () => {
  const groupId = useRecoilValue(groupIdState)
  const [curCode, setCurrencyCode] = useRecoilState(currencyCodeState)

  const handleCurrencySelected = ({target}) => {
    const currencyCode = target.value
    API.put('groupsApi', `/groups/${groupId}/currencyCode`, {
      body: {
        currencyCode
      }
    })
      .then(_response => {
        setCurrencyCode(currencyCode)
      })
      .catch(({ response }) => {
        alert(response)
      })
  }

  return (
    <div>
      <label>결제 통화 설정</label>
      <Form.Select
          defaultValue="default"
          value={curCode}
          onChange={handleCurrencySelected}
          className="form-control"
      >
        <option disabled value="default">결제 통화를 선택해 주세요</option>
        { supportedCurrencies && Object.keys(supportedCurrencies).map((code) =>
          <option key={code} value={code}>{supportedCurrencies[code].label}</option>
        )}
      </Form.Select>
    </div>
  )
}