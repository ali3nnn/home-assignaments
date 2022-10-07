import React from 'react'
import Buttons from './Buttons';

export default function Card(props) {

    return (
        <>
            {props.data.map((asset, index) => <div key={index}>
                <p className="assetId">ID: {asset._id}
                    <Buttons assetid={asset._id} {...props} />
                </p>
                {asset.type && <p>Type: {asset.type}</p>}
                {asset.serial && <p>Serial: {asset.serial}</p>}
                {asset.color && <p>Color: {asset.color}</p>}
                {asset.metadata && <p>Metadata: {JSON.stringify(asset.metadata)}<br /> </p>}
            </div>)}
        </>
    )
}
