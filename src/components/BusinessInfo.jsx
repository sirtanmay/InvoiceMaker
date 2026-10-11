import { useState, useContext } from 'react';
import { GlobalContext } from "../contextProviders/GlobalContextProvider"
import TextInput from "./TextInput";
import { toast } from 'react-toastify';

const BusinessInfo = (props) => {
    const { invData, updateInvData } = useContext(GlobalContext);
    const [formData, setFormData] = useState({ businessName: invData.businessName, businessAddress: invData.businessAddress, pan: invData.pan, GSTIN: invData.GSTIN, email: invData.email, mobileNum: invData.mobileNum });

    const { businessName, businessAddress, pan, GSTIN, email, mobileNum } = formData

    const updateFormData = (event) => {
        const data = { ...formData };
        data[event.target.id] = (event.target.tagName !== "TEXTAREA" && typeof event.target.value === "string") ? event.target.value?.trim().replace(/\s+/g, ' ') : event.target.value;
        data[event.target.id] = event.target.value;
        setFormData(data);
    }

    const saveData = () => {
        for (let key in formData) {
            invData[key] = formData[key]
        }

        updateInvData(invData);
        toast("Saved Business Info!", { type: "success" });
    }

    return <>
        <h1 className="text-2xl text-center font-bold pt-2">Your Business Info</h1>
        <form onSubmit={(event) => { event.preventDefault; return false }} autoComplete='true'>
            <div className="pt-2 text-center"><button type="button" onClick={() => props.onRouteChange('Accounts')}>Add a bank account</button></div>
            <div>
                <label htmlFor="businessName">Business Name</label>
                <div><TextInput className="capitalize" id="businessName" value={businessName} onChange={(event) => updateFormData(event)} /></div>
            </div>
            <div>
                <label htmlFor="businessAddress">Business Address</label>
                <div><textarea id="businessAddress" value={businessAddress} onChange={(event) => updateFormData(event)} /></div>
            </div>
            <div>
                <label htmlFor="pan">PAN Number</label>
                <div><TextInput className="uppercase" id="pan" value={pan} onChange={(event) => updateFormData(event)} maxLength="10" /></div>
            </div>
            <div>
                <label htmlFor="GSTIN">GSTIN</label>
                <div><TextInput id="GSTIN" value={GSTIN} onChange={(event) => updateFormData(event)} maxLength="15" /></div>
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <div><TextInput type="email" id="email" value={email} onChange={(event) => updateFormData(event)} autoComplete="on" /></div>
            </div>
            <div>
                <label htmlFor="mobileNum">Mobile</label>
                <div><TextInput type='tel' id="mobileNum" value={mobileNum} onChange={(event) => updateFormData(event)} maxLength="10" /></div>
            </div>
            <div className="mt-2"><button className='w-full' type="button" onClick={() => saveData()}>Save</button></div>
            <div className="pt-2 text-center"><button className="w-full" type="button" onClick={() => props.onRouteChange('Accounts')}>Add a bank account</button></div>
        </form>
    </>
};

export default BusinessInfo;
