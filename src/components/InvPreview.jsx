import { useContext } from 'react';
import { GlobalContext } from "../contextProviders/GlobalContextProvider"
import { usePDF } from 'react-to-pdf';

const InvoicePreview = ({ idx }) => {
    const { toPDF, targetRef } = usePDF({ filename: 'Invoice.pdf' });

    const { invData } = useContext(GlobalContext);
    const { businessName, businessAddress, pan, GSTIN: myGST, email, mobileNum, invoices } = invData
    const { invNum, invDate, subtotal, payStatus, clientName, clientMobile, billTo, billToAddress, GSTIN, items, receiverAccount } = invoices.filter((inv) => inv.invNum === idx)[0];

    return <>
        <button type="button" onClick={() => toPDF()}>Download</button>
        <div className='p-16' ref={targetRef}>
            <div className="flex justify-between items-end mt-4 mb-4 w-full max-w-5xl">
                <h2 className="text-2xl font-bold">{businessName}</h2>
                <h1 className="text-4xl font-bold">Invoice</h1>
            </div>

            <div className="mb-8">
                <div dangerouslySetInnerHTML={{
                    __html: businessAddress.replace(/\n/g, "<br />")
                }} />
                <div>Email: {email} </div>
                <div>Mobile: {mobileNum}</div>
                <div className="mt-2">PAN: {pan}</div>
                {myGST && <div className="mt-2">GST: {myGST}</div>}
            </div>

            <div className="text-xl font-bold">Bill To</div>
            <div className="flex justify-between">
                <div>{billTo}
                    <div dangerouslySetInnerHTML={{
                        __html: billToAddress.replace(/\n/g, "<br />")
                    }}></div>
                    {GSTIN && <div>GSTIN: {GSTIN}</div>}
                </div>
                <div>
                    <div className="flex justify-between mb-2"><span>Invoice #</span><span className="ml-2 font-bold">INV-{`${"0".repeat(5 - invNum.toString().length)}${invNum}`}</span></div>
                    <div className="flex justify-between mb-2"><span>Dated</span><span className="ml-2 font-bold">{(new Date(invDate)).toDateString()}</span></div>
                    <div className="flex justify-between mb-2"><span>Due Date</span><span className="ml-2 font-bold">On Receival</span></div>
                    <div className="flex justify-between mb-2"><span>Payment Status</span><span className="ml-2 font-bold">{payStatus}</span></div>

                </div>
            </div>
            <table className="mt-4 mx-auto w-full">
                <thead>
                    <tr className="items-header"><th className="p-1">Item</th><th className="p-1">Rate</th><th className="p-1">Qty</th><th className="p-1">Amount</th></tr>
                </thead>
                <tbody>
                    {
                        items.map((item, idx) => <tr key={idx}>
                            <th className="p-1 font-normal">{item.itemName}</th>
                            <th className="p-1 font-normal">Rs.{item.rate}</th>
                            <th className="p-1 font-normal">{item.quantity}</th>
                            <th className="p-1 font-normal">Rs.{item.amount}</th></tr>)
                    }
                </tbody>
                <tfoot>
                    <tr><th className="p-1 text-right" colSpan="3">Subtotal</th><th className="p-1">Rs.{subtotal}</th></tr>
                </tfoot>
            </table>

            <div className="mt-4 text-xl font-bold flex justify-between"><span></span><span>Total: Rs.{subtotal}</span></div>

            <div className="mt-8 text-xl font-bold">Pay To</div>
            <div>{receiverAccount.accountName}</div>
            <div>{receiverAccount.bankName}</div>
            <div>A/c: {receiverAccount.accNum}</div>
            <div>IFSC: {receiverAccount.ifsc}</div>
            <div>{receiverAccount.accType} Account</div>

            <div className="mt-4 text-xl font-bold">Terms & Conditions</div>
            <div>Please make payment by the due date</div>

        </div></>
}

export default InvoicePreview