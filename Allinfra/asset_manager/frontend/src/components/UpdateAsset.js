import React, { useState } from 'react'
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap";
import axios from 'axios';

const removeEmptyFields = (data) => {
    Object.keys(data).forEach((k) => {
        if (typeof data[k] === 'object') {
            data[k] = removeEmptyFields(data[k])
            if(Object.keys(data[k]).length === 0) {
                delete data[k]
            }
        } else {
            (!data[k] && data[k] !== undefined) && delete data[k]
        }
    });
    return data;
};

const getMetadata = (e) => {
    let metadata = {}
    Object.keys(e.target).forEach((key, index) => {
        const input = e.target[key];
        if (input.name === "metakey") {
            metadata = {
                ...metadata,
                [input.value]: e.target[index + 1].value
            }
        }
    })
    return metadata;
}

export default function UpdateAsset({ updatePopUpId, setUpdatePopUp, setData, data }) {

    const { REACT_APP_BASE_URL } = process.env

    const [asset, setAsset] = useState({
        "id": updatePopUpId,
        "type": "",
        "serial": "",
        "color": "",
        "metadata": ""
    })

    const onChange = (e) => {
        setAsset({
            ...asset,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        // process nested metadata
        const metadata = getMetadata(e)

        const { id, ...newAsset } = asset
        newAsset.metadata = metadata
        removeEmptyFields(newAsset)
        console.log(newAsset)

        const isCreateAssetResult = data[0].createAssetResult || false

        const response = await axios.patch(`${REACT_APP_BASE_URL}/assets/${id}`, newAsset)
        if (response.status === 201) {
            const response = await axios.get(`${REACT_APP_BASE_URL}/assets${isCreateAssetResult ? '/' + id : ''}`)
            const assetsData = response.data.result.reverse()
            setData(assetsData)
        }

        setUpdatePopUp(false)
    }

    return (
        <div className="modalWrapper">
            <div className="assetModal">
                <h1>Update the asset</h1>

                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label>id</Label>
                        <Input type="text" name="id" value={updatePopUpId && updatePopUpId} onChange={onChange} placeholder="Enter id" required></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Type</Label>
                        <Input type="text" name="type" onChange={onChange} placeholder="Enter type"></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Serial</Label>
                        <Input type="text" name="serial" onChange={onChange} placeholder="Enter serial"></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Color</Label>
                        <Input type="text" name="color" onChange={onChange} placeholder="Enter color"></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Metadata</Label>
                        <FormGroup className="metadata">
                            <Input type="text" name="metakey" placeholder="Key"></Input>
                            <Input type="text" name="metavalue" placeholder="Value"></Input>
                        </FormGroup>
                        <FormGroup className="metadata">
                            <Input type="text" name="metakey" placeholder="Key"></Input>
                            <Input type="text" name="metavalue" placeholder="Value"></Input>
                        </FormGroup>
                        <FormGroup className="metadata">
                            <Input type="text" name="metakey" placeholder="Key"></Input>
                            <Input type="text" name="metavalue" placeholder="Value"></Input>
                        </FormGroup>
                        {/* <div>Add meta</div> */}
                    </FormGroup>
                    <Button type="submit">Update asset</Button>
                    <div className="btn btn-danger ml-2" onClick={() => setUpdatePopUp(false)}>Close</div>
                </Form>
            </div >
        </div >
    )
}
