import { ReceiptText } from 'lucide-react';

const Header = ({ title }) => (
    <header className="app-header">
        <div className="header-mark"><ReceiptText size={20} strokeWidth={2.1} /></div>
        <div className="header-title-group">
            <p>INVOICE MANAGER</p>
            <h1>{title}</h1>
        </div>
        <div className="header-avatar" aria-label="Invoice Manager">IM</div>
    </header>
);

export default Header;
