import { Button, Container, Form, Row } from "react-bootstrap"
import styled from 'styled-components'
import { OverlayWrapper } from "./OverlayWrapper"
import { ServiceLogo } from "./ServiceLogo"

export const CenteredOverlayForm = ({ title, children, validated, handleSubmit }) => {
  return (
    <StyledCentralizedContainer>
      <ServiceLogo />
      <OverlayWrapper>
        <Container>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <StyledCentralizedContent>
              <Row className="aligin-items-start">
                <StyledTitle>{ title }</StyledTitle>
              </Row>
              <Row className="aligin-items-center">
                { children }
              </Row>
              <Row className="aligin-items-end">
                <StyledSubmitButton>저장</StyledSubmitButton>
              </Row>
            </StyledCentralizedContent>
          </Form>
        </Container>
      </OverlayWrapper>
    </StyledCentralizedContainer>
  )
}

const StyledCentralizedContainer = styled(Container)`
  width: 50vw;
  @media (max-width: 500px) {
    width: 80vw;
  }
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 10px;
`
const StyledTitle = styled.h2`
  font-weight: 700;
  line-height: 35px;

  text-align: right;
  overflow-wrap: break-word;
  word-break: keep-all;
`
const StyledSubmitButton = styled(Button).attrs({
  type: 'submit'
})`
  width: 60%;
  height: 50px;
  margin: 0 auto;
  background-color: #6610F2;
  border-radius: 8px;
  border: none;

  &:hover {
    background-color: #6610F2;
    filter: brightness(80%);
  }
`
const StyledCentralizedContent = styled(Row)`
  align-items: center;
  justify-content: center;
  height: 60vh;
`