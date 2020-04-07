import React, { Component, PropTypes } from 'react';
import { gettext } from '../../../i18n/service.js';
import getTooltip from '../../../businessLogic/getTooltip.js';
import { Row, FormControl, Col, ControlLabel, Glyphicon, OverlayTrigger } from 'react-bootstrap';
export class DistanceBasedCostsForm extends Component {

  renderTooltip(text) {
    return (
      <OverlayTrigger placement="top" overlay={getTooltip(text)}>
        <Glyphicon glyph="question-sign" />
      </OverlayTrigger>
    )
  }
  render() {
    const { defaultValues, onChangeCallback, isForm = false, tooltips = false, values = {} } = this.props;

    const form = (
      <div>
        <div className="text_align_center margin_bottom_em">
          <h4>{gettext('DISTANCE-BASED-COSTS')}</h4>
        </div>
        <div className="user_data center_div">
          <Row>
            <Col sm={4}>
              <ControlLabel><h4>{gettext('PICKUPCOST')}</h4></ControlLabel>
            </Col>
            <Col sm={8}>
              <FormControl
                type="number"
                required={true}
                defaultValue={defaultValues ? defaultValues.pickupCost : null}
                onChange={(e) => onChangeCallback('pickupCost', e.target.value)}
                placeholder={gettext('PICKUPCOST')} />
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <ControlLabel><h4>{gettext('DISTANCECOST')}</h4></ControlLabel>
            </Col>
            <Col sm={8}>
              <FormControl
                type="number"
                required={true}
                defaultValue={defaultValues ? defaultValues.distanceCost : null}
                onChange={(e) => onChangeCallback('distanceCost', e.target.value)}
                placeholder={gettext('DISTANCECOST')} />
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <ControlLabel><h4>{gettext('TIMECOST')}</h4></ControlLabel>
            </Col>
            <Col sm={8}>
              <FormControl
                type="number"
                required={true}
                defaultValue={defaultValues ? defaultValues.timeCost : null}
                onChange={(e) => onChangeCallback('timeCost', e.target.value)}
                placeholder={gettext('TIMECOST')} />
            </Col>
          </Row>
        </div>
      </div>
    );
    const view = (<div>
      <div className="text_align_center margin_bottom_em">
        {tooltips ? <h4>{gettext('DISTANCE-BASED-COSTS')}</h4> : <h3>{gettext('DISTANCE-BASED-COSTS')}</h3>}
      </div>
      <div className="user_data center_div">
        <Row>
          <Col sm={4}>
            <ControlLabel><h4>
              {tooltips ? gettext('PICKUPCOST') + ' ' : gettext('PICKUPCOST')}
              {tooltips ? this.renderTooltip(gettext('PICKUPCOST-TOOLTIP')) : null}
            </h4></ControlLabel>
          </Col>
          <Col sm={6}>
            <label><h4>{values.pickupCost}</h4></label>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <ControlLabel><h4>
              {tooltips ? gettext('DISTANCECOST') + ' ' : gettext('DISTANCECOST')}
              {tooltips ? this.renderTooltip(gettext('DISTANCECOST-TOOLTIP')) : null}
            </h4></ControlLabel>
          </Col>
          <Col sm={6}>
            <label><h4>{values.distanceCost}</h4></label>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <ControlLabel><h4>
              {tooltips ? gettext('TIMECOST') + ' ' : gettext('TIMECOST')}
              {tooltips ? this.renderTooltip(gettext('TIMECOST-TOOLTIP')) : null}
            </h4></ControlLabel>
          </Col>
          <Col sm={6}>
            <label><h4>{values.timeCost}</h4></label>
          </Col>
        </Row>
      </div>
    </div>)
    return isForm ? form : view;
  }
}
DistanceBasedCostsForm.propTypes = {
  defaultValues: PropTypes.object,
  onChangeCallback: PropTypes.func,
  isForm: PropTypes.bool,
  tooltips: PropTypes.bool,
  values: PropTypes.object
};
