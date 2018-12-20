import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import { Page, PageContent } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';
import { SectionWrap } from 'shared_components/layout/Page';
import UserBasicInfo from 'styled_scenes/Account/components/UserBasicInfo';
import TripSectionComponent from 'styled_scenes/Account/Trips/shared/TripSectionComponent';

const pageSize = 6;

class AccountTripsScene extends Component {
  static propTypes = {
    allTrips: PropTypes.array,
    isLoadingTrips: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    allTrips: [],
  };

  state = {
    trips: [],
    lastShown: 0,
    tripsYetNotRendered: true,
  };

  getMoreTrips = () => {
    const { allTrips } = this.props;
    this.setState(prevState => {
      if (prevState.lastShown === 0) {
        return {
          trips: allTrips.slice(0, pageSize),
          lastShown: allTrips.length >= pageSize ? pageSize : allTrips.length,
          tripsYetNotRendered: allTrips.length >= pageSize,
        };
      }

      return {
        trips: [
          ...prevState.trips,
          ...allTrips.slice(prevState.lastShown, prevState.lastShown + pageSize),
        ],
        lastShown: prevState.lastShown + pageSize,
        tripsYetNotRendered: allTrips.length >= prevState.lastShown + pageSize,
      };
    });
  };

  render() {
    const { isLoadingTrips } = this.props;
    return (
      <div>
        <Page topPush>
          <TopBar fixed />
          <PageContent padding="24px">
            <Grid centered columns={2}>
              <Grid.Column mobile={16} tablet={5} computer={4}>
                <SectionWrap>
                  <UserBasicInfo user_profile={this.props.user} />
                </SectionWrap>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={11} computer={12}>
                <h1>My Trips</h1>
                <TripSectionComponent
                  isLoadingTrips={isLoadingTrips}
                  trips={this.state.trips}
                  allTrips={this.props.allTrips}
                  getMoreTrips={this.getMoreTrips}
                  tripsYetNotRendered={this.state.tripsYetNotRendered}
                />
              </Grid.Column>
            </Grid>
          </PageContent>
        </Page>
      </div>
    );
  }
}

export default withRouter(AccountTripsScene);
