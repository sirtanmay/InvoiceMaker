import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Building2, FilePlus2, Landmark, ReceiptText } from 'lucide-react';
import Header from "./components/Header";
import InvList from "./components/InvList"
import BusinessInfo from "./components/BusinessInfo"
import ManageInvoices from "./components/ManageInvoices"
import BankAccounts from "./components/BankAccounts"



import './App.css'

function App() {

    const [currentRouteName, setCurrentRouteName] = useState("Dashboard");

    const routes = [
        { routeName: "Dashboard", view: InvList, label: "Invoices", icon: ReceiptText },
        { routeName: "Manage", view: ManageInvoices, label: "Create", icon: FilePlus2 },
        { routeName: "Accounts", view: BankAccounts, label: "Accounts", icon: Landmark },
        { routeName: "BusinessInfo", view: BusinessInfo, label: "Business", icon: Building2 },
    ];

    const currentRoute = routes.find(route => route.routeName === currentRouteName);

    return (
        <div className="app-shell">
            <Header title={currentRoute?.label ?? "Invoices"} />
            <ToastContainer />

            <main className={`app-content screen-${currentRouteName.toLowerCase()}`}>
                {getViewForRoute([currentRoute], setCurrentRouteName)}
            </main>

            <nav className="bottom-nav" aria-label="Main navigation">
                {routes.map(route => {
                    const Icon = route.icon;
                    const isCurrent = currentRouteName === route.routeName;

                    return <button
                        className={`bottom-nav-item ${isCurrent ? "current" : ""}`}
                        onClick={() => setCurrentRouteName(route.routeName)}
                        key={route.routeName}
                        aria-current={isCurrent ? "page" : undefined}
                    >
                        <Icon size={21} strokeWidth={isCurrent ? 2.4 : 1.8} />
                        <span>{route.label}</span>
                    </button>
                })}
            </nav>
        </div>
    )
}

function getViewForRoute(route, param) {
    let Component = null;

    if (route && route.length > 0) {
        Component = route[0].view
    }

    return <Component onRouteChange={param} />;
}

export default App
