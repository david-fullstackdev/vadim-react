import React from 'react';
import { Tooltip } from 'react-bootstrap';



export default function getTooltip(text) {
  return (
    <Tooltip><strong>{text}</strong></Tooltip>
  );
}
