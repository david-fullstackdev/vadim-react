import React, {PropTypes} from 'react';
import { Button, OverlayTrigger,Modal, Popover, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { gettext } from '../i18n/service.js';
import _ from 'lodash';
import getCurLang from '../businessLogic/getCurLang.js';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';
import {sortDriver} from '../businessLogic/sortGroupage.js';
import filterStatOnlyDone from '../businessLogic/filterGroupage.js';
import {Table, Tr, Td, Th, Thead} from 'reactable';

let i = 0;

export default function UsersList(props) {
  var users = _.sortBy(props.users, ['createdAt']).reverse();
  const DeleteConfirm = React.createClass({
    getInitialState() {
      return { showModal: false };
    },

    close() {
      this.setState({ showModal: false });
    },

    open() {
      this.setState({ showModal: true });
    },

    render() {
      return (
        <div className="inline_block">
          <Button bsStyle="danger" bsSize="xsmall" onClick={this.open}>
            { gettext('DELETE-USER') }
          </Button>

          <Modal show={this.state.showModal} onHide={this.close} dir={getCurLang()==='ar'?'rtl':'ltr'}>
            <Modal.Body>
              <p>{gettext('DELETE-USER-CONFIRMATION')}  <strong>{this.props.user.email}</strong></p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>{gettext('NO')}</Button>
              <Button onClick={() => props.deleteUser(this.props.user)} bsStyle="danger">{gettext('YES')}</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  });



  return (
    <div className="user_list_container">
      <OverlayTrigger  id="kek" trigger="click" rootClose placement="bottom" overlay={
          <Popover id="addUserPopover" title={gettext('NEW-USER')}>
            <ListGroup>
              <ListGroupItem>
                <Link to="/createUser/operator">{ gettext('OPERATOR') }</Link>
              </ListGroupItem>
              <ListGroupItem>
                <Link to="/createUser/dispatcher">{ gettext('DISPATCHER') }</Link>
              </ListGroupItem>
              <ListGroupItem>
                <Link to="/createUser/driver">{ gettext('DRIVER') }</Link>
              </ListGroupItem>
              {LoopbackHttp.isAdministrator?
              <ListGroupItem>
                <Link to="/createUser/dispatcherPlatform">{ gettext('DISPATCHER-PLATFORM') }</Link>
              </ListGroupItem>:''
            }
            </ListGroup>
          </Popover>
        }>
        <Button bsStyle="default">+</Button>
      </OverlayTrigger>
      <Table className="users_table" dir = {getCurLang()==='ar'?'rtl':'ltr'}
      sortable={[
        {
          column: gettext('USER-ROLE'),
          sortFunction: sortDriver
        },
        {
          column: gettext('USER-REG-DATE'),
          sortFunction: sortDriver
        },
        {
          column: gettext('SHOP-NAME'),
          sortFunction: sortDriver
        }
      ]}
      filterable={[
        gettext('NAME'),
        gettext('SHOP-NAME'),
        gettext('EMAIL')
      ]}>
      <Thead>
        <Th column={gettext('EMAIL')}>
          <label title={gettext('EMAIL')}>{gettext('EMAIL')}</label>
        </Th>
        <Th column={gettext('SHOP-NAME')}>
          <label title={gettext('SHOP-NAME')}>{gettext('SHOP-NAME')}</label>
        </Th>
        <Th column={gettext('NAME')}>
          <label title={gettext('NAME')}>{gettext('NAME')}</label>
        </Th>
        <Th column={gettext('PHONE-NUMBER')}>
          <label title={gettext('PHONE-NUMBER')}>{gettext('PHONE-NUMBER')}</label>
        </Th>
        <Th column={gettext('USER-ROLE')}>
          <label title={gettext('USER-ROLE')}>{gettext('USER-ROLE')}</label>
        </Th>
        <Th column={gettext('USER-REG-DATE')}>
          <label title={gettext('USER-REG-DATE')}>{gettext('USER-REG-DATE')}</label>
        </Th>
        <Th column="" />
      </Thead>
          {_.map(users, ( user ) => {
            return (
              <Tr key={i++}
                style={{cursor: "pointer"}}>
                <Td column={ gettext('EMAIL') }>
                  {user.email}
                </Td>
                <Td column={ gettext('SHOP-NAME') }>
                  {user.shopName}
                </Td>
                <Td column={ gettext('NAME') }>
                  {user.firstName?user.firstName:user.name}
                </Td>
                <Td column={ gettext('PHONE-NUMBER') }>
                  {user.phone
                    ?user.phone
                    :user.mobile }
                </Td>
                <Td column={ gettext('USER-ROLE') }>
                  {user.role}
                </Td>
                <Td column={ gettext('USER-REG-DATE') }>
                  {user.createdAt.substring(0,10)}
                </Td>
                { !(LoopbackHttp.isOperator && (user.role==='dispatcher-platform' || (user.role==='operator')))?
                <Td column="">
                  <div>
                    <div className="inline_block">
                      <Button
                        bsStyle="warning"
                        bsSize="xsmall"
                        onClick={() => props.showUserInfo(user)}>
                        { gettext('EDIT-USER') }
                      </Button>
                    </div>
                    { LoopbackHttp.isAdministrator ?
                      <DeleteConfirm  user={user}/>: '' }
                  </div>
                </Td> : ''
                }

              </Tr>
            );
          })}
      </Table>
    </div>
  );
}




UsersList.propTypes = {
  users: PropTypes.array,
  showUserInfo: PropTypes.func,
  user: PropTypes.object
};
