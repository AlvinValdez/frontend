import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../trip/actions';
import { update_search_query_without_search, update_path } from '../../../scenes/results/actions';
import moment from 'moment';
import TripOrganizer from '../../../styled_scenes/TripOrganizer';
import history from 'main/history';
import { loadTrip, removeTrip } from 'libs/localStorage';
import axios from 'libs/axios';

class TripOrganizerContainer extends Component {
  constructor(props) {
    super(props);
    if (props.match.params.id) {
      props.fetchTrip(props.match.params.id);
    } else {
      if (this.props.session.username) {
        this.isLoading = true;
        const tripToSave = {
          ...this.props.trip,
          services: this.props.trip.services.map(service => ({
            ...service,
            service: service.service._id,
          })),
        };
        axios.post(`/trips`, tripToSave).then(response => {
          if (props.location.state.action === 'book') {
            history.push(`/trips/checkout/${response.data._id}`);
            removeTrip();
            return;
          } else if (props.location.state.action === 'share') {
            history.push(`/trips/share/${response.data._id}`);
            removeTrip();
            return;
          }
          history.push(`/trips/organize/${response.data._id}`, this.props.location.state);
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.match.params.id && this.props.match.params.id) {
      this.isLoading = false;
      this.props.fetchTrip(this.props.match.params.id);
    }
    if (this.props.trip && this.props.trip.bookingStatus === 'booked') {
      history.replace(`/trips/${this.props.match.params.id}`);
    }
  }

  render() {
    return (
      <TripOrganizer
        availability={this.props.availability}
        trip={this.props.trip}
        tripId={this.props.match.params.id}
        startDate={moment(this.props.startDate)}
        adults={this.props.adults || 1}
        children={this.props.children}
        infants={this.props.infants}
        changeDates={this.props.changeDates}
        updatePath={this.props.updatePath}
        history={this.props.history}
        isGDPRDismissed={this.props.isGDPRDismissed}
        isLoading={this.props.isLoading || this.isLoading}
        action={
          this.props.location && this.props.location.state && this.props.location.state.action
        }
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  const trip = props.match.params.id ? state.TripReducer.trip : loadTrip();

  let startDate = state.ResultsReducer.search_query.start_date;
  if (!startDate) {
    const tomorrow = moment()
      .add(1, 'days')
      .startOf('day');
    if (!trip) {
      startDate = tomorrow;
    } else {
      const tripDate = moment(trip.startDate).startOf('day');
      startDate = tripDate.diff(tomorrow, 'days') >= 0 ? tripDate : tomorrow;
    }
  }

  return {
    session: state.SessionsReducer.session,
    trip,
    error: state.TripReducer.error,
    isLoading: state.TripReducer.isLoading,
    owner: state.TripReducer.owner,
    adults: state.ResultsReducer.search_query.adults,
    children: state.ResultsReducer.search_query.children,
    infants: state.ResultsReducer.search_query.infants,
    startDate,
    endDate: state.ResultsReducer.search_query.end_date,
    availability: state.TripReducer.availability,
    isGDPRDismissed: state.SettingsReducer.gdprDismissed,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
      changeDates: update_search_query_without_search,
      updatePath: update_path,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripOrganizerContainer));
