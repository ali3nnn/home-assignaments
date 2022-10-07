import {
    Button
} from "reactstrap";
import React, { useState } from 'react'
import CreateAsset from "./CreateAsset";
import Viewer from "./Viewer";
import UpdateAsset from "./UpdateAsset";
import axios from 'axios'

const { REACT_APP_BASE_URL } = process.env

const getAssetFromDb = async () => {
    const assets = await axios.get(`${REACT_APP_BASE_URL}/assets`);
    return assets.data.result.reverse()
}

export default function Home() {

    const [createAssetPopUp, setCreateAssetPopUp] = useState(false)
    const [updatePopUp, setUpdatePopUp] = useState(false)
    const [updatePopUpId, setUpdatePopUpId] = useState()

    const [data, setData] = useState(undefined)

    const getAll = async () => {
        try {
            setData(["loading"])
            const assetsData = await getAssetFromDb()
            setData(assetsData)
        } catch (error) {
            if (error.response.status === 404) {
                setData([])
            } else {
                setData(["getError"])
            }
        }
    }

    const viewerProps = {
        setData,
        data,
        setUpdatePopUp,
        updatePopUp,
        setUpdatePopUpId
    }

    const updateAssetProps = {
        updatePopUpId,
        setUpdatePopUp,
        setData,
        data
    }

    return (
        <>
            <div className="dashboard">
                <Button onClick={() => setCreateAssetPopUp(!createAssetPopUp)}>Create an asset</Button>
                <Button onClick={() => getAll()}>Get all assets</Button>
                <Button onClick={() => setData()}>Clear screen</Button>
            </div>
            {createAssetPopUp && <CreateAsset setPopUp={setCreateAssetPopUp} setData={setData} />}
            {updatePopUp && <UpdateAsset {...updateAssetProps} />}
            {data && <Viewer {...viewerProps} />}
        </>
    )
}
