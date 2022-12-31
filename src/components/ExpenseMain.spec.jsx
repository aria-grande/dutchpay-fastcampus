import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RecoilRoot } from "recoil"
import { groupMembersState } from "../state/groupMembers"
import { ExpenseMain } from "./ExpenseMain"
import { API } from "aws-amplify"

const renderComponent = () => {
  render(
    <RecoilRoot initializeState={(snap) => {
      snap.set(groupMembersState, ['영수', '영희'])
    }}>
      <ExpenseMain />
    </RecoilRoot>
  )

  const dateInput = screen.getByPlaceholderText(/결제한 날짜/i)
  const descInput = screen.getByPlaceholderText(/비용에 대한 설명/i)
  const amountInput = screen.getByPlaceholderText(/비용은 얼마/i)
  const payerInput = screen.getByDisplayValue(/누가 결제/i)
  const addButton = screen.getByText('추가하기')
  const shareButton = screen.getByTestId('share-btn')

  const descErrorMessage = screen.getByText('비용 내용을 입력해 주셔야 합니다.')
  const payerErrorMessage = screen.getByText('결제자를 선택해 주셔야 합니다.')
  const amountErrorMessage = screen.getByText('1원 이상의 금액을 입력해 주셔야 합니다.')

  return {
    dateInput,
    descInput,
    amountInput,
    payerInput,
    addButton,
    shareButton,
    descErrorMessage,
    payerErrorMessage,
    amountErrorMessage,
  }
}

describe('비용 정산 메인 페이지', () => {
  beforeEach(() => {
    // API.put을 mocking 함으로써, 실제 네트워크 리퀘스트를 보내지 않고 성공 응답이 온 것처럼 acting 해야
    // 프론트 엔드가 의도한 대로 동작하는지 테스트 할 수 있기 때문
    API.put = jest.fn().mockResolvedValue({"data": {}})
    console.error = jest.fn()
  })

  describe('비용 추가 컴포넌트', () => {
    test('비용 추가 컴포넌트 렌더링', () => {
      const {dateInput, descInput, amountInput, payerInput, addButton} = renderComponent()

      expect(dateInput).toBeInTheDocument()
      expect(descInput).toBeInTheDocument()
      expect(amountInput).toBeInTheDocument()
      expect(payerInput).toBeInTheDocument()
      expect(addButton).toBeInTheDocument()
    })

    test('비용 추가에 필수적인 값을 입력하지 않고 "추가" 버튼 클릭시, 에러 메시지를 노출한다', async () => {
      const {addButton, descErrorMessage, payerErrorMessage, amountErrorMessage} = renderComponent()

      expect(addButton).toBeInTheDocument()
      userEvent.click(addButton)

      await waitFor(() => {
        expect(descErrorMessage).toHaveAttribute('data-valid', 'false')
      })
      expect(payerErrorMessage).toHaveAttribute('data-valid', 'false')
      expect(amountErrorMessage).toHaveAttribute('data-valid', 'false')
    })

    test('비용 추가에 필수적인 값들을 입력한 후 "추가" 버튼 클릭시, 저장에 성공', async () => {
      const {descInput, amountInput, payerInput, addButton,
        descErrorMessage, payerErrorMessage, amountErrorMessage} = renderComponent()

      userEvent.type(descInput, '장보기')
      userEvent.type(amountInput, '30000')
      userEvent.selectOptions(payerInput, '영수')
      userEvent.click(addButton)

      await waitFor(() => {
        expect(descErrorMessage).toHaveAttribute('data-valid', 'true')
      })
      expect(payerErrorMessage).toHaveAttribute('data-valid', 'true')
      expect(amountErrorMessage).toHaveAttribute('data-valid', 'true')
    })
  })

  describe('비용 리스트 컴포넌트', () => {
    test('비용 리스트 컴포넌트가 렌더링 되는가?', () => {
      renderComponent()
      const expenseListComponent = screen.getByTestId('expenseList')

      expect(expenseListComponent).toBeInTheDocument()
    })
  })

  describe('정산 결과 컴포넌트', () => {
    test('정산 결과 컴포넌트가 렌더링 되는가?', () => {
      renderComponent()

      const component = screen.getByText(/정산은 이렇게/i)
      expect(component).toBeInTheDocument()
    })
  })

  describe('새로운 비용이 입력 되었을 때,', () => {
    const addNewExpense = () => {
      const {dateInput, descInput, payerInput, amountInput, addButton} = renderComponent()
      userEvent.type(dateInput, '2022-10-10')
      userEvent.type(descInput, '장보기')
      userEvent.type(amountInput, '30000')
      userEvent.selectOptions(payerInput, '영수')
      userEvent.click(addButton)
    }

    beforeEach(() => {
      addNewExpense()
    })

    test('날짜, 내용, 결제자, 금액 데이터가 정산 리스트에 추가 된다', async () => {
      const expenseListComponent = screen.getByTestId('expenseList')
      const dateValue = within(expenseListComponent).getByText('2022-10-10')
      await waitFor(() => {
        expect(dateValue).toBeInTheDocument()
      })

      const descValue = within(expenseListComponent).getByText('장보기')
      expect(descValue).toBeInTheDocument()

      const payerValue = within(expenseListComponent).getByText('영수')
      expect(payerValue).toBeInTheDocument()

      const amountValue = within(expenseListComponent).getByText('30000 원')
      expect(amountValue).toBeInTheDocument()
    })

    test('정산 결과 또한 업데이트가 된다.', async () => {
      const totalText = screen.getByText(/2 명이서 총 30000 원 지출/i)
      await waitFor(() => {
        expect(totalText).toBeInTheDocument()
      })

      const transactionText = screen.getByText(/영희 → 영수 : 15000 원/i)
      expect(transactionText).toBeInTheDocument()
    })

    const htmlToImage = require('html-to-image')
    test('정산 결과를 이미지 파일로 저장할 수 있다', async () => {
      const spiedToPng = jest.spyOn(htmlToImage, 'toPng')

      const downloadBtn = screen.getByTestId("btn-download")
      await waitFor(() => {
        expect(downloadBtn).toBeInTheDocument()
      })

      userEvent.click(downloadBtn)
      await waitFor(() => {
        expect(spiedToPng).toHaveBeenCalledTimes(1)
      })
    })

    afterEach(() => {
      jest.resetAllMocks()
    })
  })

  describe('공유 버튼 컴포넌트', () => {
    test('공유 버튼 컴포넌트가 렌더링 되는가?', () => {
      const { shareButton } = renderComponent()
      expect(shareButton).toBeInTheDocument()
    })

    describe('공유 버튼 클릭시', () => {
      let userAgent = jest.spyOn(window.navigator, 'userAgent', 'get')

      describe('모바일에서', () => {
        beforeAll(() => {
          global.navigator.share = jest.fn()
          userAgent.mockReturnValue('iPhone')
        })
        test('공유용 다이얼로그가 뜬다', async () => {
          const { shareButton } = renderComponent()

          userEvent.click(shareButton)

          await waitFor(() => {
            expect(navigator.share).toBeCalledTimes(1)
          })
        })
      })

      describe('데스크톱에서', () => {
        beforeAll(() => {
          userAgent.mockReturnValue('Mozilla/5.0 Chrome/108.0.0.0 Safari/537.36')
          global.navigator.clipboard = {
            writeText: () => new Promise(jest.fn())
          }
        })

        test('클립보드에 링크가 복사된다', async () => {
          const writeText = jest.spyOn(navigator.clipboard, 'writeText')
          const { shareButton } = renderComponent()

          userEvent.click(shareButton)

          expect(writeText).toBeCalledTimes(1)
          expect(writeText).toHaveBeenCalledWith(window.location.href)
        })
      })
    })
  })
})