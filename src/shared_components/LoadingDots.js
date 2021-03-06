import React from 'react'
import styled from 'styled-components'

const Dots = styled.div`
  position:relative;
  margin: auto;
  display: flex;

@keyframes loading {
  0%, 100% {
    transform: initial;
    opacity: 0.4;
  }

  50% {
    transform: scale(2);
    opacity: 1;
  }
}
`

const Dot = styled.span`
  width:3px;
  height:3px;
  border-radius:50%;
  margin-right:11px;
  background:#262626;
  animation: loading 0.7s linear infinite;
  animation-fill-mode: both;

  &:nth-child(2) {
    animation-delay: -0.6s;
  }

  &:nth-child(3) {
    animation-delay: -0.5s;
  }
`

export default () => (
  <Dots>
    <Dot />
    <Dot />
    <Dot />
  </Dots>
)
