import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

import { Jumbotron, Button, Row, PageHeader,FormGroup, FormControl, Col, ControlLabel, Glyphicon,OverlayTrigger  } from 'react-bootstrap';
import { gettext } from '../../../i18n/service.js';
import _ from 'lodash';
import AvatarCropper from "react-avatar-cropper";

var FileUpload = React.createClass({

  handleFile: function(e) {
    var reader = new FileReader();
    var file = e.target.files[0];

    if (!file) return;

    reader.onload = function(img) {
      // ReactDOM.findDOMNode(this.refs.in).value = '';
      this.props.handleFileChange(img.target.result);
    }.bind(this);
    reader.readAsDataURL(file);
  },

  render: function() {
    return (
      <input ref="in" type="file" accept="image/*" onChange={(e) => this.handleFile(e)} />
    );
  }
});

export default class AvatarComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    _.bindAll(this, ['handleFileChange', 'handleCrop', 'handleRequestHide']);

    this.state = {
      cropperOpen: false,
      img: props.avatar,
      croppedImg: props.avatar,
      imageStatus: 'loading',
      random: Date.now()
    };

  }

  componentWillReceiveProps(nextProps) {
    this.setState({random: Date.now()});
  }

  handleFileChange(dataURI) {
    this.setState({
      img: dataURI,
      croppedImg: this.state.croppedImg,
      cropperOpen: true
    });
  }

  handleCrop(dataURI) {
    this.props.changeAvatar(dataURI)

    this.setState({
      cropperOpen: false,
      img: null,
      croppedImg: dataURI
    });
  }

  handleRequestHide() {
    this.setState({
      cropperOpen: false
    });
  }

  render() {

    return (
      <div className="avatar">
        {this.props.edit
          ? <div>
              <FileUpload handleFileChange={this.handleFileChange} />
              <div className="avatar-edit">
                <Glyphicon glyph="camera" />
              </div>
              <img
                src={(this.props.avatar)&&(this.props.avatar.length < 500)?`${this.props.avatar}?date=${this.state.random}`:`${this.props.avatar}`}
                className="avatar_img avatar_img_edit"
                onLoad={()=>this.setState({ imageStatus: 'loaded' })}/>
              <AvatarCropper
                onRequestHide={this.handleRequestHide}
                cropperOpen={this.state.cropperOpen}
                onCrop={this.handleCrop}
                image={this.state.img}
                width={400}
                height={400}/>
            </div>
          : <img
              src={`${this.props.avatar}?date=${this.state.random}`} 
              className="avatar_img"
              onLoad={()=>this.setState({ imageStatus: 'loaded' })}/>
        }
        {this.state.imageStatus==='loading'?<div className="load" />:''}
      </div>
    );
  }
}




AvatarComponent.propTypes = {

};
