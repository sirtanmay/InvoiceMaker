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

            <div className="invoice-list-heading">
                <p className="eyebrow">YOUR WORKSPACE</p>
                <h2>Recent invoices</h2>
                <span className="invoice-count">{invoices.length} {invoices.length === 1 ? "invoice" : "invoices"}</span>
            </div>
            <ul className="inv-list">
                {
                    invoices.toReversed().map(inv => <li key={inv.invNum} onClick={() => { setSelectedInvoice(inv.invNum); setIsModalOpen(true); }}><InvItem invoice={inv} /></li>)
                }
            </ul>


        </> : <>
            <div className="empty-state">
                <h2>No invoices yet</h2>
                <p>Your invoices will appear here once you create one.</p>
                <button type="button" onClick={() => props.onRouteChange('Manage')}>Create invoice</button>
            </div>
        </>

    )
}

function InvItem(props) {
    const inv = props.invoice;

    return (
        <>
            <div className="invoice-item-top">
                <span className="invoice-number">INV-{`${"0".repeat(Math.max(0, 5 - String(inv.invNum).length))}${inv.invNum}`}</span>
                <span>{(new Date(inv.invDate)).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <div className="invoice-item-bottom">
                <div className="invoice-client">
                    <strong>{inv.clientName || inv.billTo || "Untitled client"}</strong>
                    <span>{inv.billTo || inv.clientMobile || "No billing name"}</span>
                </div>
                <div className="invoice-amount">
                    <strong>Rs.{Number(inv.subtotal || 0).toLocaleString("en-IN")}</strong>
                    <span className={`invoice-status ${inv.payStatus === "PAID" ? "paid" : ""}`}>{inv.payStatus || "UNPAID"}</span>
                </div>
            </div>
        </>
    )

}

export default InvList;
