import React from 'react';
import Card from './Card';

const renderInfo = (data) => {

    if (data.length === 0) {
        return "No items"
    }

    switch (data[0]) {
        case "loading":
            return "Loading..."
        case "getError":
            return "Error when retrieving data"
        case "removeError":
            return "Error removing the item"
        case "createdItemRemoved":
            return " "
        default:
            return
    }
}

export default function Viewer(props) {

    return (
        <div className="viewContainer" items={props.data.length}>
            {renderInfo(props.data) ? <h3 className="info">{renderInfo(props.data)}</h3> : <Card {...props} />}
        </div>
    )
}
