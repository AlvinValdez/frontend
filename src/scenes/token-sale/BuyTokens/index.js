import React from 'react';
import styled from 'styled-components';
import { media } from 'libs/styled';
import { Segment } from 'semantic-ui-react';
import Input from 'shared_components/StyledInput';
import BuyButton from './BuyButton';
import { Link } from 'react-router-dom';
import round from 'lodash.round';

const plsValue = 0.036;
const preIcoBonus = 20; // in %

const Wrapper = styled.div`
  max-width: 650px;
  margin: 30px auto;
  text-align: center;
`;

const SegmentContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${media.minSmall} {
    padding: 0 132px;
  }
`;

const SegmentTitle = styled.div`
  font-size: 18px;
  text-align: center;
`;

const PLSNumber = styled.div`
  background-color: #38d39f;
  color: white;
  display: inline-block;
  border-radius: 5px;
  padding: 11px 43px;
  margin: 18px auto 0;
`;

const HowMuch = styled.p`
  margin-top: 30px;
  text-align: left;
`;

const Divider = styled.div`
  border-bottom: 1px solid #e0e0e0;
  margin-top: 10px;
`;

const Table = styled.div`
  margin-top: 14px;
  text-align: left;
  margin-bottom: 30px;
`;

const Row = styled.div`
  display: flex;
`;

const FirstCol = styled.div`
  flex-grow: 1;
`;

const SecondCol = styled.div`
  flex-shrink: 1;
`;

const SmartContractLink = styled(Link)`
  color: #38d39f;
  text-decoration: underline;
`;

const USDInput = styled.span`
  color: #c1c1c1;
  font-weight: bold;
`;

export default class BuyTokens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
    };
  }

  inputChange = event => {
    const value = Number(event.target.value);
    this.setState({ amount: value });
  };

  render() {
    const plsToBuy = round(this.state.amount / plsValue, 8);
    const bonus = (Number(plsToBuy) * preIcoBonus) / 100;
    const total = (Number(plsToBuy) + Number(bonus)).toFixed(2);
    return (
      <Wrapper>
        <SmartContractLink to="/token-sale/smart-contract">
          Contribute through smart contract
        </SmartContractLink>
        <Segment>
          <SegmentContent>
            <SegmentTitle>My PLS</SegmentTitle>
            <PLSNumber>{this.props.plsBalance || 0} PLS</PLSNumber>
          </SegmentContent>
        </Segment>
        <Segment>
          <SegmentContent>
            <SegmentTitle>Purchase Tokens</SegmentTitle>
            <HowMuch>How much would you like to contribute?</HowMuch>
            <Input
              leftContent={this.state.amount ? <USDInput>USD</USDInput> : null}
              type="number"
              min="1"
              step="any"
              onChange={this.inputChange}
              placeholder="Amount in USD"
            />
            <Table>
              <Divider />
              <Row>
                <FirstCol>Amount in PLS (1 PLS = ${plsValue})</FirstCol>
                <SecondCol>{plsToBuy.toFixed(2)}</SecondCol>
              </Row>
              <Divider />
              <Row>
                <FirstCol>(Pre-ICO) {preIcoBonus}% bonus in PLS</FirstCol>
                <SecondCol>{bonus.toFixed(2)}</SecondCol>
              </Row>
              <Divider />
              <Row>
                <FirstCol>Total amount in PLS</FirstCol>
                <SecondCol>≈ {total}</SecondCol>
              </Row>
            </Table>
            <BuyButton amount={this.state.amount} onSuccess={this.props.onTokenBought} />
          </SegmentContent>
        </Segment>
      </Wrapper>
    );
  }
}
