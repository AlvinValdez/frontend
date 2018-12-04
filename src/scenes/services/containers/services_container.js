import React, { Component } from 'react';
import ServiceComponent from './../components/service_component';
import * as services_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { getSession } from 'libs/user-session';
import NotFoundScene from 'styled_scenes/NotFound';

class ServicesContainer extends Component {
  state = {
    recentlyAddedToTrip: undefined,
  };

  componentDidMount() {
    const service_id = this.props.match.params.id;
    this.props.fetch_service(service_id);
    const user = getSession();
    if (user != null) {
      this.props.fetchMyTrips();
    }
    this.props.setAddedToTripMessage(undefined);
    //if (!this.props.abi) this.props.fetchServiceContractABI();
  }

  componentWillUnmount() {
    this.props.resetServiceData();
  }

  onAddServiceToTrip = ({ trip, day }) => {
    const user = getSession();
    if (user != null) {
      this.props.addServiceToTrip({ trip, day });
    } else {
      this.props.history.push('/login');
    }
  };

  onAddServiceToNewTrip = () => {
    const user = getSession();
    if (user != null) {
      this.props.createNewTrip();
    } else {
      this.props.history.push('/login');
    }
  };

  render() {
    if (this.props.serviceFetchError.code === 404) {
      return <NotFoundScene />;
    } else {
      return (
        <ServiceComponent
          {...this.props}
          onAddServiceToTrip={this.onAddServiceToTrip}
          onAddServiceToNewTrip={this.onAddServiceToNewTrip}
        />
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    service: state.ServicesReducer.service,
    trips: state.ServicesReducer.trips.filter(trip => trip !== undefined),
    reviews: state.ServicesReducer.reviews,
    myUnpurchasedTrips: state.ServicesReducer.userUnpurchasedTrips.data,
    serviceRecentlyAddedToTrip: state.ServicesReducer.serviceRecentlyAddedToTrip,
    serviceAlreadyAddedToTrip: state.ServicesReducer.serviceAlreadyAddedToTrip,
    isServiceUnavailableModalOpen: state.ServicesReducer.isServiceUnavailableModalOpen,
    abi: state.ServicesReducer.abi,
    isPageLoading: state.ServicesReducer.isPageLoading,
    isLoading: state.ServicesReducer.isUpdatingTrip || state.ServicesReducer.isCreatingTrip,
    serviceFetchError: state.ServicesReducer.serviceFetchError,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(services_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ServicesContainer));
