import React, { PropTypes } from 'react';
import { gettext } from '../../../i18n/service.js';

function iconInfo(order) {
    if (order.express) {
        return {
            name: 'red',
            title: gettext('EXPRESS-DELIVERY')
        }
    }

    if (order.isOutOfCity) {
        return {
            name: 'blue',
            title: gettext('OUT-OF-CITY')
        }
    }

    return {
        name: 'violet',
        title: 'Regular delivery'
    }
}

export function OrderIdIcon({ order }) {
    const info = iconInfo(order);
    return <img title={info.title} src={`./side_id_${info.name}.svg`} />;
}