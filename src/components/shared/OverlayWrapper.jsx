
import styled from 'styled-components'

export const OverlayWrapper = ({ children, padding, minHeight }) => (
  <StyledContainer padding={padding} minHeight={minHeight} >{ children }</StyledContainer>
)

const StyledContainer = styled.div`
  padding: ${(props) => props.padding || '2vw'};
  @media screen and (max-width: 600px) {
    padding: 6vw;
  }
  border-radius: 15px;
  background-color: white;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  min-height: ${(props) => props.minHeight || '0'};
`