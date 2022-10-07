import React from 'react'
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const { REACT_APP_BASE_URL } = process.env
const removeAssetFromDb = async (id) => await axios.delete(`${REACT_APP_BASE_URL}/assets/${id}`)
const getAllAssetsFromDb = async () => {
    const assets = await axios.get(`${REACT_APP_BASE_URL}/assets`);
    return assets.data.result.reverse()
}

export default function Buttons({ setUpdatePopUp, updatePopUp, setUpdatePopUpId, setData, data, assetid }) {

    const updateHandler = async (e) => {
        e.preventDefault();
        const id = e.target.attributes.assetid.value
        setUpdatePopUpId(id)
        setUpdatePopUp(!updatePopUp)
    }

    const removeHandler = async (e) => {
        e.preventDefault();
        const id = e.target.attributes.assetid.value

        try {
            await removeAssetFromDb(id);
            hideCard(e)
        }
        catch (error) {
            if (error.response.status === 404) {
                // the asset has been previosuly removed by another instance
                // so I just update the UI with all the existing assets in DB
                await handleRemoveHandlerFailure()
            } else {
                setData(["removeError"])
            }
        }
    }

    const handleRemoveHandlerFailure = async () => {
        try {
            setData(["loading"])
            const response = await getAllAssetsFromDb();
            setData(response);
        } catch (error) {
            if (error.response.status === 404) {
                setData([])
            } else {
                setData(["getError"])
            }
        }
    }

    const hideCard = (e) => {
        const idToRemove = e.target.attributes.assetid.value
        const dataWithIdRemoved = data.filter(asset => asset._id !== idToRemove)
        const isCreateAssetResult = data[0].createAssetResult || false
        if (isCreateAssetResult) {
            setData(["createdItemRemoved"])
        } else {
            setData(dataWithIdRemoved)
        }
    }

    return (
        <>
            <span className="updateButton noselect" assetid={assetid} onClick={updateHandler}><EditIcon /></span>
            <span className="removeButton noselect" assetid={assetid} onClick={removeHandler}><DeleteIcon /></span>
        </>
    )
}
