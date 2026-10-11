import { useContext } from 'react';
import { GlobalContext } from "../contextProviders/GlobalContextProvider"
import { usePDF } from 'react-to-pdf';
import { Download } from 'lucide-react';

const InvoicePreview = ({ idx }) => {
    const { toPDF, targetRef } = usePDF({
        filename: 'Invoice.pdf',
        method: 'save',
        page: { format: 'A4', orientation: 'portrait', margin: 0 },
        canvas: { mimeType: 'image/png', qualityRatio: 1 },
    });

    const { invData } = useContext(GlobalContext);
    const { businessName, businessAddress, pan, GSTIN: myGST, email, mobileNum, invoices } = invData
    const { invNum, invDate, subtotal, payStatus, billTo, billToAddress, GSTIN, items, receiverAccount } = invoices.filter((inv) => inv.invNum === idx)[0];

    return <>
        <div className="invoice-toolbar">
            <span>Invoice preview</span>
            <button className="invoice-download" type="button" onClick={() => toPDF()}>
                <Download size={17} />
                Download PDF
            </button>
        </div>
        <div className="invoice-preview-scroll">
            <article className="invoice-document" ref={targetRef}>
                <header className="invoice-document-header">
                    <div>
                        <h2>{businessName}</h2>
                        <div className="invoice-business-details">
                            {businessAddress && <div dangerouslySetInnerHTML={{ __html: businessAddress.replace(/\n/g, "<br />") }} />}
                            {email && <div>Email: {email}</div>}
                            {mobileNum && <div>Mobile: {mobileNum}</div>}
                            {pan && <div>PAN: {pan}</div>}
                            {myGST && <div>GST: {myGST}</div>}
                        </div>
                    </div>
                    <div className="invoice-heading">
                        <h1>INVOICE</h1>
                    </div>
                </header>

                <section className="invoice-parties">
                    <div className="invoice-bill-to">
                        <p className="invoice-section-label">BILL TO</p>
                        <strong>{billTo}</strong>
                        {billToAddress && <div dangerouslySetInnerHTML={{ __html: billToAddress.replace(/\n/g, "<br />") }} />}
                        {GSTIN && <div>GSTIN: {GSTIN}</div>}
                    </div>
                    <dl className="invoice-meta">
                        <div><dt>Invoice #</dt><dd>INV-{`${"0".repeat(5 - invNum.toString().length)}${invNum}`}</dd></div>
                        <div><dt>Dated</dt><dd>{(new Date(invDate)).toDateString()}</dd></div>
                        <div><dt>Due Date</dt><dd>On Receival</dd></div>
                        <div><dt>Payment Status</dt><dd>{payStatus}</dd></div>
                    </dl>
                </section>

                <table className="invoice-items-table">
                    <thead>
                        <tr><th>Item</th><th>Rate</th><th>Qty</th><th>Amount</th></tr>
                    </thead>
                    <tbody>
                        {items.map((item, itemIndex) => <tr key={itemIndex}>
                            <td>{item.itemName}</td>
                            <td>Rs. {Number(item.rate || 0).toLocaleString("en-IN")}</td>
                            <td>{item.quantity}</td>
                            <td>Rs. {Number(item.amount || 0).toLocaleString("en-IN")}</td>
                        </tr>)}
                    </tbody>
                    <tfoot>
                        <tr><th colSpan="3">Subtotal</th><td>Rs. {Number(subtotal || 0).toLocaleString("en-IN")}</td></tr>
                    </tfoot>
                </table>

                <div className="invoice-total"><span>Total:</span><strong>Rs. {Number(subtotal || 0).toLocaleString("en-IN")}</strong></div>

                <footer className="invoice-document-footer">
                    <section>
                        <p className="invoice-section-label">Pay To</p>
                        <strong>{receiverAccount.accountName}</strong>
                        <div>{receiverAccount.bankName}</div>
                        <div>A/c: {receiverAccount.accNum}</div>
                        <div>IFSC: {receiverAccount.ifsc}</div>
                        <div>{receiverAccount.accType} Account</div>
                    </section>
                    <section className="invoice-terms">
                        <p className="invoice-section-label">Terms &amp; Conditions</p>
                        <div>Please make payment by the due date</div>
                    </section>
                </footer>
            </article>
        </div>
    </>
}

export default InvoicePreview