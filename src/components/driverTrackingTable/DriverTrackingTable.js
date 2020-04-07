import React, {Component, PropTypes} from 'react';
import {Table, Tr, Td} from 'reactable';
import _ from 'lodash';
import {formatTime} from '../../businessLogic/deliveryTimeFormatter.js';
import './DriverTrackingTable.scss';
import { gettext } from '../../i18n/service';

const columns = [
  {
    title: gettext('DATE-AND-TIME'),
    render: (gpsLog) => formatTime(gpsLog.gpsTimestamp)
  },
  {
    title: gettext('ADDRESS'),
    render: (log) => log.address || gettext('CANNOT-GET-ADDRESS')
  },
  {
    title: gettext('STATUS'),
    render: (log) => log.itemStatus
  }
];

export class DriverTrackingTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const tableRows = _(this.props.gpsLogs).sortBy('gpsTimestamp').reverse()
      .map((log) => {

        return (
          <Tr
            key={`log_${log.id}`}
            >
            {_.map(columns, column => (
                <Td column={column.title}>
                  {column.render(log)}
                </Td>
              )
            )}
          </Tr>
        );
      })
      .value();
    return (
      <Table
        className="driverTrackingTable"
        itemsPerPage={15}
        pageButtonLimit={5}
        noDateText={ gettext('NOTHING-TO-SHOW') }
        onPageChange={(pageNumber) => this.currentTablePage = pageNumber}
        currentPage={this.currentTablePage || 0}
        sortable={false}
        filterable={false}
        >
        {tableRows}
      </Table>
    );
  }
}



DriverTrackingTable.propTypes = {
  gpsLogs: PropTypes.array
};
