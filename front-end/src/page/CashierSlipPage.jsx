import { useEffect, useState } from "react"
import SlipCard from "../components/SlipCard"
import api from "../axios"

export default function CashierSlipPage() {
    const [slips, setSlips] = useState([])

    const loadSlips = async () => {
        const { data } = await api.get("/payment/pending-slips")
        setSlips(data)
    }

    const handleAction = async (slipId, action) => {
        await api.post("/payment/verify-slip", {
            slipId,
            action
        })
        loadSlips()
    }

    useEffect(() => {
        loadSlips()
    }, [])

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {slips.map((slip) => (
                <SlipCard
                    key={slip.id}
                    slip={slip}
                    onAction={handleAction}
                />
            ))}
        </div>
    )
}
