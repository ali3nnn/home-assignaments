import React, { useState } from 'react'
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap";
import axios from 'axios';

export default function CreateAsset({ setPopUp, setData }) {

    const { REACT_APP_BASE_URL } = process.env

    const [asset, setAsset] = useState({
        "type": "",
        "serial": "",
        "color": "",
        "metadata": ""
    })

    const onChange = (e) => {
        switch (e.target.name) {
            case "metakey":
                setAsset({
                    ...asset,
                    metadata: {
                        ...asset.meta,
                        [e.target.value]: e.target.nextSibling.value
                    }
                })
                break;
            case "metadata":
                setAsset({
                    ...asset,
                    metadata: {
                        ...asset.meta,
                        [e.target.previousSibling.value]: e.target.value
                    }
                })
                break;
            default:
                setAsset({
                    ...asset,
                    [e.target.name]: e.target.value
                })
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const newAsset = asset
        const response = await axios.post(`${REACT_APP_BASE_URL}/assets`, newAsset)
        setData([{
            ...response.data.result[0],
            "createAssetResult": true
        }])
        setPopUp(false)
    }

    return (
        <div className="modalWrapper">
            <div className="assetModal">
                <h1>Create a new asset</h1>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label>Type</Label>
                        <Input type="text" name="type" onChange={onChange} placeholder="Enter type" required></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Serial</Label>
                        <Input type="text" name="serial" onChange={onChange} placeholder="Enter serial" required></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Color</Label>
                        <Input type="text" name="color" onChange={onChange} placeholder="Enter color" required></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Metadata</Label>
                        <FormGroup className="metadata" onChange={onChange}>
                            <Input type="text" name="metakey" placeholder="Key" required></Input>
                            <Input type="text" name="metadata" placeholder="Value" required></Input>
                        </FormGroup>
                        {/* <div>Add meta</div> */}
                    </FormGroup>
                    <Button type="submit">Create asset</Button>
                    <div className="btn btn-danger ml-2" onClick={() => setPopUp(false)}>Close</div>
                </Form>
            </div>
        </div>
    )
}
