import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RecoilRoot } from "recoil"
import { AddMembers } from "./AddMembers"
import { API } from "aws-amplify"
import { BrowserRouter } from "react-router-dom"
import { wait } from "@testing-library/user-event/dist/utils"

const renderComponent = () => {
  render(
    <BrowserRouter>
      <RecoilRoot>
        <AddMembers />
      </RecoilRoot>
    </BrowserRouter>
  )

  const input = screen.getByTestId("input-member-names")
  const saveButton = screen.getByText('저장')

  return {
    input,
    saveButton,
  }
}

describe('그룹 멤버 추가 페이지', () => {
  beforeEach(() => {
    // API.put을 mocking 함으로써, 실제 네트워크 리퀘스트를 보내지 않고 성공 응답이 온 것처럼 acting 해야
    // 프론트 엔드가 의도한 대로 동작하는지 테스트 할 수 있기 때문
    API.put = jest.fn().mockResolvedValue({"data": {}})
  })

  test('그룹 멤버 입력 컴포넌트가 렌더링 되는가', () => {
    const {input, saveButton} = renderComponent()

    expect(input).not.toBeNull()
    expect(saveButton).not.toBeNull()
  })

  test('그룹 멤버를 입력하지 않고 "저장" 버튼을 클릭시, 에러 메시지를 노출한다', async () => {
    const {saveButton} = renderComponent()

    userEvent.click(saveButton)

    const errorMessage = await screen.findByText('그룹 멤버들의 이름을 입력해 주세요.')
    await waitFor(() => {
      expect(errorMessage).toBeInTheDocument()
    })
  })

  test('그룹 멤버의 이름들을 입력한 후, "저장" 버튼을 클릭시, 저장에 성공', async () => {
    const {input, saveButton} = renderComponent()

    userEvent.type(input, '철수 영희 영수')
    userEvent.click(saveButton)

    const errorMessage = screen.queryByText('그룹 멤버들의 이름을 입력해 주세요.')
    await waitFor(() => {
      expect(errorMessage).toBeNull()
    })
  })
})