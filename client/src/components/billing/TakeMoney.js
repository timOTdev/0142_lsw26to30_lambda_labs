import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Image from './logo.png';
import axios from 'axios';

export default class TakeMoney extends React.Component {
  onToken = async token => {
    const url = 'http://localhost:9000/billing/charge';
    try {
      await axios.post(url, {
        token: token,
        subType: this.props.subType
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  render() {
    return (
      <StripeCheckout // This component uses the token created above to make a one time payment
        token={this.onToken}
        stripeKey="pk_test_Y6iNnz4ImmbwJDcFA982Hahf"
        name="Refreshr"
        description="Purchase your subscription"
        panelLabel="Purchase"
        image={Image} // We should have a second smaller logo image without text
        amount={this.props.subType} //cents
        currency="USD"
        email="nickoferrall@gmail.com" // will update this to the user email
        // bitcoin={true} // looks like it's depreciated
        // alipay={true}
      />
    );
  }
}
