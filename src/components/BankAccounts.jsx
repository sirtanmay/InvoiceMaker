import { useState, useContext, useRef } from 'react';
import { GlobalContext } from "../contextProviders/GlobalContextProvider"
import TextInput from "./TextInput";
import { toast } from 'react-toastify';

const BusinessInfo = () => {
    const blankData = { accId: "", bankName: "", branch: "", accountName: "", accNum: "", ifsc: "", accType: "" };
    const { invData, updateInvData } = useContext(GlobalContext);
    const [formData, setFormData] = useState(blankData);
    const focusRef = useRef();

    const { accId, bankName, branch, accountName, accNum, ifsc, accType } = formData
    const accList = invData.receivingAccounts ?? [];


    const updateFormData = (event) => {
        const data = { ...formData };
        data[event.target.id] = event.target.value;
        setFormData(data);
    }

    const saveData = () => {
        const data = { ...formData };
        for (let key in data) {
            data[key] = (typeof data[key] === "string") ? data[key]?.trim().replace(/\s+/g, ' ') : data[key];
        }
        if (!data.accNum || !data.ifsc || !data.bankName) {
            setFormData(data)
            toast('Error: Enter all the information', { type: "error" });
            return false;
        }

        if (!formData.accId) {
            let lastAccId = 0;
            if (accList.length > 0)
                lastAccId = accList[accList.length - 1].accId;

            data.accId = lastAccId + 1
            accList.push(data);
        }
        else {
            const accIdx = accList.findIndex(acc => acc.accId == formData.accId)

            for (let key in data) {
                accList[accIdx][key] = data[key];
                data[key] = "";
            }
        }

        invData.receivingAccounts = accList;

        updateInvData(invData);
        setFormData(blankData);

        toast("Saved Account Info!", { type: "success" });
    }

    const deleteData = () => {
        const newAccList = accList.filter(acc => acc.accId !== formData.accId)
        invData.receivingAccounts = newAccList;

        updateInvData(invData);
        setFormData(blankData);

        toast("Deleted Account!", { type: "warning" });

    }

    const preventSubmit = (e) => {
        e.preventDefault();
        console.log("Form explicitly submitted via button click!");
    };

    const checkKeyDown = (e) => {
        // If the user presses Enter and they are NOT inside a textarea, prevent submission
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    }

    return <>
        <h2 className="text-2xl text-center font-bold pt-2">Enter Account Info</h2>
        <form onSubmit={preventSubmit} onKeyDown={checkKeyDown}>
            <div>
                <label htmlFor="bankName">Bank Name</label>
                <div><TextInput id="bankName" value={bankName} onChange={(event) => updateFormData(event)} ref={focusRef} /></div>
            </div>
            <div>
                <label htmlFor="branch">Branch Name</label>
                <div><TextInput id="branch" value={branch} onChange={(event) => updateFormData(event)} /></div>
            </div>
            <div>
                <label htmlFor="accountName">Account Holder Name</label>
                <div><TextInput id="accountName" value={accountName} onChange={(event) => updateFormData(event)} /></div>
            </div>
            <div>
                <label htmlFor="accNum">Account Number</label>
                <div><TextInput id="accNum" value={accNum} onChange={(event) => updateFormData(event)} /></div>
            </div>
            <div>
                <label htmlFor="ifsc">IFSC Code</label>
                <div><TextInput id="ifsc" value={ifsc} onChange={(event) => updateFormData(event)} /></div>
            </div>
            <div>
                <label htmlFor="accType">Account Type</label>
                <div><TextInput id="accType" value={accType} onChange={(event) => updateFormData(event)} /></div>
            </div>

            <div className="flex mt-2">
                {formData.accId && <button className='w-full' type="button" onClick={() => deleteData()}>Delete</button>}
                <button className='w-full' type="submit" onClick={() => saveData()}>Save</button>
            </div>

        </form>

        {accList?.length > 0 &&
            <>
                <h2 className="text-2xl text-center font-bold pt-4 pb-2">Your Bank Accounts</h2>
                <ul className="pb-6">
                    {
                        accList.map(acc =>
                            <li onClick={() => { setFormData(acc); focusRef.current.focus() }} className={`cursor-pointer border-1 border-gray-200 border-l-4 border-l-blue-500 p-2 ${acc.accId == formData.accId ? "bg-yellow-100" : ""}`} key={acc.accId}>
                                <div>{acc.accountName}</div>
                                <div>{acc.accNum} ({acc.accType})</div>
                                <div>{acc.ifsc}</div>
                                <div>{acc.bankName}, {acc.branch}</div>
                                <div></div>
                            </li>)
                    }
                </ul>
            </>
        }
    </>
};

export default BusinessInfo;

