import { useState, useContext, useRef } from 'react';
import { GlobalContext } from "../contextProviders/GlobalContextProvider"
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import SelectList from './SelectList';
import Checkbox from './Checkbox';
import { toast } from 'react-toastify';


const ManageInvoices = (props) => {
    const blankData = { invNum: "", invDate: "", subtotal: 0, payStatus: "UNPAID", clientName: "", clientMobile: "", billTo: "", billToAddress: "", GSTIN: "", items: [{ itemName: "", quantity: "1", rate: "", amount: "", }], receiverAccount: {} };
    const { invData, updateInvData } = useContext(GlobalContext);
    const [formData, setFormData] = useState(blankData);
    const focusRef = useRef();

    const PreRequisites = ({ businessInfo, rcvAccounts }) => {
        return !businessInfo ?
            <div className="pt-32 text-xl text-center">You need to setup your business information.
                <div className="pt-2 text-base"><button type="button" onClick={() => props.onRouteChange('BusinessInfo')}>Set up now </button></div>
            </div>
            : !rcvAccounts ?
                <div className="pt-32 text-xl text-center">You need to add Bank Account Info.
                    <div className="pt-2 text-base"><button type="button" onClick={() => props.onRouteChange('Accounts')}>Add now</button></div>
                </div> : null
    }

    if (!invData.businessName || !(invData.receivingAccounts?.length > 0))
        return <PreRequisites businessInfo={invData.businessName} rcvAccounts={(invData.receivingAccounts?.length > 0)} />

    const { invNum, invDate, subtotal, payStatus, clientName, clientMobile, billTo, billToAddress, GSTIN, items, receiverAccount } = formData
    const invList = invData.invoices ?? [];
    const receivingAccounts = invData.receivingAccounts;
    const accountOptions = () => {
        return receivingAccounts.map(acc => {
            return {
                label: acc.accNum + ' ' + acc.bankName + ' ' + acc.accountName,
                value: acc
            }
        });
    }

    const markPaid = (event) => {
        const data = structuredClone(formData);
        data.payStatus = data.payStatus === "UNPAID" ? "PAID" : "UNPAID";
        setFormData(data);
    }
    const handleAccountSelect = (opt) => {
        const data = structuredClone(formData);
        data.receiverAccount = opt.value;
        setFormData(data);
    }
    const addInvItem = () => {
        const newItem = { itemName: "", quantity: "1", rate: "", amount: "" }
        const data = structuredClone(formData);
        data.items.push(newItem);
        setFormData(data);
    }

    const getSubtotal = (frmdata) => {
        let itemsSubTotal = 0;
        frmdata.items.forEach(itm => { itemsSubTotal += itm.rate && itm.quantity ? itm.rate * itm.quantity : 0 });
        return itemsSubTotal;
    }
    const removeInvItem = (idx) => {
        const data = structuredClone(formData);
        data.items.splice(idx, 1);
        data.subtotal = getSubtotal(data);

        setFormData(data);
    }
    const updateInvoiceItem = (event) => {
        const data = structuredClone(formData);

        const targetIdSplit = event.target.id.split("-");
        const key = targetIdSplit[0];
        const idx = targetIdSplit[1];

        data.items[idx][key] = event.target.value;
        data.items[idx].amount = data.items[idx].rate && data.items[idx].quantity ? data.items[idx].rate * data.items[idx].quantity : ""
        data.subtotal = getSubtotal(data);

        setFormData(data);
    }

    const updateFormData = (event) => {
        const data = structuredClone(formData);
        data[event.target.id] = event.target.value;
        setFormData(data);
    }

    const saveData = () => {
        const data = structuredClone(formData);
        for (let key in data) {
            data[key] = (typeof data[key] === "string") && data[key].indexOf("\n") == -1 ? data[key].trim().replace(/\s+/g, ' ') : data[key];
        }
        if (!data.clientName || !data.receiverAccount || !data.subtotal) {
            setFormData(data)
            toast('Error: Enter all the information', { type: "error" });
            return false;
        }

        if (!formData.invNum) {
            let lastinvNum = 0;
            if (invList.length > 0)
                lastinvNum = invList[invList.length - 1].invNum;

            data.invNum = lastinvNum + 1
            invList.push(data);
        }
        else {
            const invIdx = invList.findIndex(inv => inv.invNum == formData.invNum)

            for (let key in data) {
                invList[invIdx][key] = data[key];
                data[key] = "";
            }
        }

        invData.invoices = invList;

        updateInvData(invData);
        setFormData(blankData);

        toast("Saved Account Info!", { type: "success" });
    }

    const deleteData = () => {
        const newinvList = invList.filter(inv => inv.invNum !== formData.invNum)
        invData.invoices = newinvList;

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
        <h2 className="text-2xl text-center font-bold pt-2">Enter Invoice Info</h2>
        <form onSubmit={preventSubmit} onKeyDown={checkKeyDown}>
            <div className="pt-4">
                <label htmlFor="clientName">Client / Contact Person Name</label>
                <div><TextInput id="clientName" value={clientName} onChange={(event) => updateFormData(event)} ref={focusRef} /></div>
            </div>
            <div className="pt-4">
                <label htmlFor="clientMobile">Client Mobile Number</label>
                <div><TextInput type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" id="clientMobile" value={clientMobile} onChange={(event) => updateFormData(event)} maxLength="10" /></div>
            </div>
            <div className="pt-4">
                <label htmlFor="invDate">Invoice Date</label>
                <div><TextInput id="invDate" value={invDate} onChange={(event) => updateFormData(event)} type="date" min={(new Date()) - 10} /></div>
            </div>
            <div className="pt-4">
                <label htmlFor="billTo">Bill To</label>
                <div><TextInput id="billTo" value={billTo} onChange={(event) => updateFormData(event)} /></div>
            </div>
            <div className="pt-4">
                <label htmlFor="billToAddress">Billing Address</label>
                <div><TextAreaInput id="billToAddress" value={billToAddress} onChange={(event) => updateFormData(event)} /></div>
            </div>
            <div className="pt-4">
                <label htmlFor="GSTIN">GSTIN</label>
                <div><TextInput id="GSTIN" value={GSTIN} onChange={(event) => updateFormData(event)} /></div>
            </div>
            <div className="py-4">
                <label htmlFor="receiverAccount">Pay to Account</label>
                <div><SelectList placeholder='Select bank account' id="receiverAccount" options={accountOptions()} selectOption={receiverAccount} onChange={(opt) => { handleAccountSelect(opt) }} /></div>
            </div>
            <div className="text-sm font-bold pt-4 px-1 flex justify-between">
                <span>Invoice Items</span>
                <span>Subtotal: {subtotal}</span>
            </div>
            {
                items.map((itm, idx) => <div key={idx}>
                    <div className="border-1 border-gray-200 border-l-4 border-l-blue-500 p-2">
                        <div><TextInput id={`itemName-${idx}`} value={items[idx].itemName} placeholder="Invoice item name" onChange={(event) => updateInvoiceItem(event)} /></div>
                        <div><TextInput id={`rate-${idx}`} value={items[idx].rate} placeholder="Rate" type="number" onChange={(event) => updateInvoiceItem(event)} onWheel={(event) => { event.target.blur() }} /></div>
                        <div><TextInput id={`quantity-${idx}`} value={items[idx].quantity} placeholder="Quantity" type="number" min="1" onChange={(event) => updateInvoiceItem(event)} onWheel={(event) => { event.target.blur() }} /></div>
                    </div>
                    <div className='text-right'>
                        {items.length > 1 &&
                            <button type="button" className="!rounded-full text-lg my-2 !p-0 w-8 h-8 leading-none" onClick={() => removeInvItem(idx)}>-</button>}
                        <button type="button" className="!rounded-full text-lg ml-1 my-2 !p-0 w-8 h-8 leading-none" onClick={() => addInvItem()}>+</button>
                    </div>
                </div>)
            }


            {invNum && <div className="py-4">
                <label htmlFor="paid">Mark as paid</label>
                <Checkbox id="paid" className="!w-auto " checked={payStatus === "PAID"} onChange={markPaid} />
            </div>}

            <div className="flex pt-4">
                {formData.invNum && <button className='w-full' type="button" onClick={() => deleteData()}>Delete</button>}
                <button className='w-full' type="submit" onClick={() => saveData()}>Save</button>
            </div>

        </form>

        {invList?.length > 0 &&
            <>
                <h2 className="text-2xl text-center font-bold pt-4 pb-2">Your Invoices</h2>
                <ul className="pb-6">
                    {
                        invList.toReversed().map(inv =>
                            <li onClick={() => { setFormData(inv); focusRef.current.focus() }} className={`cursor-pointer border-1 border-gray-200 border-l-2 border-l-blue-500 p-2 ${inv.invNum == formData.invNum ? "bg-yellow-100" : ""}`} key={inv.invNum}>
                                <div className="flex justify-between font-bold text-sm mb-2">
                                    <span>{(new Date(inv.invDate)).toDateString()}</span>
                                    <span>Rs.{inv.subtotal} ({inv.payStatus})</span></div>
                                <div className="flex justify-between"><span>{inv.clientName}</span><span>{inv.clientMobile}</span></div>
                            </li>)
                    }
                </ul>
            </>
        }
    </>
};

export default ManageInvoices;
