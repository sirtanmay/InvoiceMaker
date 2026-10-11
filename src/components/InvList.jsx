import { useContext, useState } from 'react';
import { GlobalContext } from "../contextProviders/GlobalContextProvider"
import InvPreview from "./InvPreview"
import Modal from './Modal/Modal';

function InvList(props) {
    const { invData } = useContext(GlobalContext)
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const invoices = invData.invoices

    return (
        invoices && invoices.length > 0 ? <>
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedInvoice(null) }}>
                <InvPreview idx={selectedInvoice} />
            </Modal>

            <ul className="inv-list">
                {
                    invoices.toReversed().map(inv => <li key={inv.invNum} onClick={() => { setSelectedInvoice(inv.invNum); setIsModalOpen(true); }}><InvItem invoice={inv} /></li>)
                }
            </ul>


        </> : <>
            <div className="pt-6 text-center text-2xl font-bold">No invoices yet.</div>
            <div className="pt-2 text-xl text-center"><button type="button" onClick={() => props.onRouteChange('Manage')}>Create a new</button></div>
        </>

    )
}

function InvItem(props) {
    const inv = props.invoice;

    return (
        <>
            <div className="flex justify-between text-sm">
                <span>Inv #{inv.invNum} <span>{inv.status}</span></span>
                <span>{(new Date(inv.invDate)).toDateString()}</span>
            </div>
            <div className="flex justify-between text-md font-bold">
                <span>{inv.billTo} ({inv.clientName})</span>
                <span>Rs.{inv.subtotal} ({inv.payStatus})</span>
            </div>
        </>
    )

}

export default InvList;
