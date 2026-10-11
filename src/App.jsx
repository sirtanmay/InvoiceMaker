import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Header from "./components/header";
import InvList from "./components/InvList"
import BusinessInfo from "./components/BusinessInfo"
import ManageInvoices from "./components/ManageInvoices"
import BankAccounts from "./components/BankAccounts"



import './App.css'

function App() {

    const [currentRouteName, setCurrentRouteName] = useState("Dashboard");
    const [currentInvoiceIndex, setCurrentInvoiceIndex] = useState(-1);

    const routes = [
        { routeName: "Dashboard", view: InvList, label: "Invoices List", showAllButtons: true },
        { routeName: "Manage", view: ManageInvoices, label: "Manage Invoices", showAllButtons: true },
        { routeName: "BusinessInfo", view: BusinessInfo, label: "Business Info", showAllButtons: true },
        { routeName: "Detail", showAllButtons: false },
        { routeName: "Accounts", view: BankAccounts, showAllButtons: false },
    ];

    const currentRoute = routes.filter(route => route.routeName === currentRouteName)[0];

    return (
        <>
            <Header />
            <ToastContainer />

            <nav className="flex justify-end pt-4">
                {
                    currentRoute?.showAllButtons ?
                        routes.map(route => route.label &&
                            <button
                                className={`tab ${currentRouteName === route.routeName ? "current" : ""}`}
                                onClick={() => setCurrentRouteName(route.routeName)}
                                key={route.routeName}
                            >{route.label}
                            </button>
                        ) :
                        <button onClick={() => setCurrentRouteName("Dashboard")}>Back</button>
                }
            </nav>

            <main>
                {
                    getViewForRoute(routes.filter(route => route.routeName === currentRouteName), setCurrentRouteName)
                }

            </main>
        </>
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
