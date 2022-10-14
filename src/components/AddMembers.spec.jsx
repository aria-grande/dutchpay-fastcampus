import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RecoilRoot } from "recoil"
import { AddMembers } from "./AddMembers"

const renderComponent = () => {
  render(
    <RecoilRoot>
      <AddMembers />
    </RecoilRoot>
  )

  const input = screen.getByTestId("input-member-names")
  const saveButton = screen.getByText('저장')

  return {
    input,
    saveButton,
  }
}

describe('그룹 멤버 추가 페이지', () => {
  test('그룹 멤버 입력 컴포넌트가 렌더링 되는가', () => {
    const {input, saveButton} = renderComponent()

    expect(input).not.toBeNull()
    expect(saveButton).not.toBeNull()
  })

  test('그룹 멤버를 입력하지 않고 "저장" 버튼을 클릭시, 에러 메시지를 노출한다', async () => {
    const {saveButton} = renderComponent()

    await userEvent.click(saveButton)

    const errorMessage = await screen.findByText('그룹 멤버들의 이름을 입력해 주세요.')
    expect(errorMessage).toBeInTheDocument()
  })

  test('그룹 멤버의 이름들을 입력한 후, "저장" 버튼을 클릭시, 저장에 성공', async () => {
    const {input, saveButton} = renderComponent()

    await userEvent.type(input, '철수 영희 영수')
    await userEvent.click(saveButton)

    const errorMessage = screen.queryByText('그룹 멤버들의 이름을 입력해 주세요.')
    expect(errorMessage).toBeNull()
  })
})