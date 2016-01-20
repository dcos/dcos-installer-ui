import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import ErrorLabel from '../components/ErrorLabel';
import IconCircleCheckmark from '../components/icons/IconCircleCheckmark';
import IconSpinner from '../components/icons/IconSpinner';
import IconWarning from '../components/icons/IconWarning';
import IconRetry from '../components/icons/IconRetry';
import InstallerStore from '../stores/InstallerStore';
import Page from '../components/Page';
import PageContent from '../components/PageContent';
import PageSection from '../components/PageSection';
import PreFlightStore from '../stores/PreFlightStore';
import ProgressBar from '../components/ProgressBar';
import SectionBody from '../components/SectionBody';
import SectionHeader from '../components/SectionHeader';
import SectionHeaderIcon from '../components/SectionHeaderIcon';
import SectionHeaderPrimary from '../components/SectionHeaderPrimary';
import SectionHeaderSecondary from '../components/SectionHeaderSecondary';
import SectionFooter from '../components/SectionFooter';

module.exports = class Preflight extends mixin(StoreMixin) {
  constructor() {
    super();

    this.store_listeners = [
      {name: 'preFlight', events: ['stateChange']}
    ];
  }

  componentWillMount() {
    PreFlightStore.init();
  }

  getHeaderIcon(completed, failed, totalErrors) {
    if (completed && totalErrors === 0) {
      return <IconCircleCheckmark />;
    }

    if (completed && totalErrors > 0) {
      return <IconWarning />;
    }

    return <IconSpinner />;
  }

  getHeaderContent(completed, failed, totalErrors) {
    if (completed) {
      if (failed) {
        return 'Pre-Flight Failed';
      }

      if (totalErrors > 0) {
        return 'Pre-Flight Completed with Errors';
      }

      return 'Pre-Flight Complete';
    }

    return 'Running Pre-Flight';
  }

  getProgressBarDetail(status, total) {
    if (status.completed) {
      return '';
    }

    let hostCount = status.totalStarted;
    return `Checking ${hostCount} of ${total}`;
  }

  getProgressBarLabel(type, completed, errors) {
    if (errors > 0 && completed) {
      return `Errors with ${errors} ${type}`;
    }

    if (completed) {
      return `${type} Check Complete`;
    }

    return `Checking ${type}`;
  }

  getProgressBar(type, status, totalOfType) {
    let completed = status.completed;
    let progress = ((status.totalStarted / totalOfType) * 100) || 0;
    let state = 'ongoing';

    if (completed && status.errors > 0) {
      state = 'error';
    } else if (completed) {
      state = 'success';
    }

    return (
      <ProgressBar
        detail={this.getProgressBarDetail(status, totalOfType)}
        label={this.getProgressBarLabel(type, status.completed, status.errors)}
        progress={progress} state={state} />
    );
  }

  getActions(completed, failed, totalErrors) {
    let buttons = (
      <button className="disabled button button-stroke button-rounded">
        Deploy
      </button>
    );

    if (completed && totalErrors === 0) {
      buttons = (
        <button className="button button-stroke button-success button-rounded">
          Deploy
        </button>
      );
    }

    if (completed && totalErrors > 0) {
      buttons = [
        <button
          key="retry"
          onClick={PreFlightStore.init.bind(PreFlightStore)}
          className="button button-large button-stroke button-rounded">
          <IconRetry />
          Retry
        </button>,
        <button
          key="deploy"
          className="button button-large button-stroke button-success
          button-rounded">
          Deploy
        </button>
      ];
    }

    if (failed) {
      buttons = (
        <button
          onClick={PreFlightStore.init.bind(PreFlightStore)}
          className="button button-stroke button-rounded">
          <IconRetry />
          Retry
        </button>
      );
    }

    return (
      <div className="button-collection">
        {buttons}
      </div>
    );
  }

  render() {
    let masterStatus = PreFlightStore.get('masters');
    let slaveStatus = PreFlightStore.get('slaves');

    let completed = masterStatus.completed && slaveStatus.completed;
    let failed = masterStatus.errors > 0;
    let totalErrors = masterStatus.errors + slaveStatus.errors;
    let totalSlaves = InstallerStore.get('totalSlaves');
    let totalMasters = InstallerStore.get('totalMasters');

    return (
      <Page hasNavigationBar={true}>
        <PageContent>
          <PageSection>
            <SectionHeader>
              <SectionHeaderIcon>
                {this.getHeaderIcon(completed, failed, totalErrors)}
              </SectionHeaderIcon>
              <SectionHeaderPrimary>
                {this.getHeaderContent(completed, failed, totalErrors)}
              </SectionHeaderPrimary>
              <SectionHeaderSecondary>
                <ErrorLabel step="preflight" />
              </SectionHeaderSecondary>
            </SectionHeader>
            <SectionBody>
              {this.getProgressBar('Masters', masterStatus, totalMasters)}
              {this.getProgressBar('Agents', slaveStatus, totalSlaves)}
            </SectionBody>
          </PageSection>
          <PageSection>
            <SectionFooter>
              {this.getActions(completed, failed, totalErrors)}
            </SectionFooter>
          </PageSection>
        </PageContent>
      </Page>
    );
  }
}
