import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';
import { CreateGroup } from './CreateGroup';
import { API } from "aws-amplify"
import { BrowserRouter } from 'react-router-dom';

const renderComponent = () => {
  render(
    <BrowserRouter>
      <RecoilRoot>
        <CreateGroup />
      </RecoilRoot>
    </BrowserRouter>
  )

  const input = screen.getByPlaceholderText('2022 제주도 여행')
  const saveButton = screen.getByText('저장')
  const errorMessage = screen.getByText('그룹 이름을 입력해 주세요.')

  return {
    input,
    saveButton,
    errorMessage
  }
}
describe('그룹 생성 페이지', () => {

  beforeEach(() => {
    // API.put을 mocking 함으로써, 실제 네트워크 리퀘스트를 보내지 않고 성공 응답이 온 것처럼 acting 해야
    // 프론트 엔드가 의도한 대로 동작하는지 테스트 할 수 있기 때문
    API.post = jest.fn().mockResolvedValue({"data": { guid: "TESTING-GUID" }})
    console.error = jest.fn()
  })

  test('그룹 이름 입력 컴포넌트가 렌더링 되는가', () => {
    const {input, saveButton} = renderComponent()

    expect(input).not.toBeNull()
    expect(saveButton).not.toBeNull()
  })

  test('그룹 이름을 입력하지 않고 "저장" 버튼을 클릭시, 에러 메시지를 노출한다', () => {
    const {saveButton, errorMessage} = renderComponent()

    userEvent.click(saveButton)
    expect(errorMessage).toHaveAttribute('data-valid', 'false')
  })

  test('그룹 이름을 입력 후, "저장" 버튼을 클릭시, 저장 성공', async () => {
    const {input, saveButton, errorMessage} = renderComponent()

    userEvent.type(input, '예시 그룹명')
    userEvent.click(saveButton)

    await waitFor(() => {
      expect(errorMessage).toHaveAttribute('data-valid', 'true')
    })
  })
})