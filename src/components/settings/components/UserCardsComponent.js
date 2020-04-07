import React, {PropTypes} from 'react';
import { Jumbotron, Button, Row, PageHeader,FormGroup, FormControl, Col, ControlLabel, Link  } from 'react-bootstrap';
import {Table, Tr, Td, Th, Thead} from 'reactable';
import { gettext } from '../../../i18n/service.js';
import _ from 'lodash';
import {connect} from 'react-redux';

class UserCardsComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.cards = this.props.cards;
    this.props.getCards(this.props.account.id);

    _.bindAll(this, ['getSelectedCard', 'deleteCard']);
  }

  getSelectedCard(id) {
    this.selectedCard = _.find(this.props.cards, { 'id': id });
    this.forceUpdate();
  }

  flipCreateCard() {
    this.props.router.push('/addCard');
    this.forceUpdate();
  }

  deleteCard() {
    _.pull(this.props.cards, this.selectedCard);
    this.props.deleteCard(this.props.account.id, this.selectedCard.id);
    this.forceUpdate();
  }

  render() {
    let cards = _.map(this.props.cards, (card) => {
      const isCardSelected = card === this.selectedCard;
      const className = isCardSelected ? 'active' : '';
      return (
        <Tr className={className} key={card.id} onClick={(e) => this.getSelectedCard(card.id)}>
          <Td column={gettext('TITLE')}>
            { card.title }
          </Td>
        </Tr>
      );
    });

    return (
      <div className='dispatcher_profile'>
        <Jumbotron>
          <div className="item_head_title">
            <h3>{gettext('CARDS')}</h3>
          </div>
          <Row className="center_flex">
              <Col sm={10}>
                <Col sm={12}>
                    <div className="table_container">
                        <Table className="company_table table-fixedheader">
                          <Thead>
                            <Th column={gettext('TITLE')}>
                              <span title={gettext('TITLE')}>{gettext('TITLE')}</span>
                            </Th>
                          </Thead>
                          {cards}
                        </Table>
                    </div>
                  <div className="milti_controls">
                   <Button className="multi_btn margin_bottom_halfem" onClick={() => {this.flipCreateCard()}}>+</Button>
                   <Button className="multi_btn margin_bottom_halfem"
                   onClick={() => this.deleteCard()}>
                    -
                   </Button>
                  </div>
                </Col>

              </Col>
          </Row>
        </Jumbotron>
      </div>
    );
  }
}




UserCardsComponent.propTypes = {

};

function mapStateToProps(state) {
  return {
    cards: state.appReducer.cards
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserCardsComponent);
