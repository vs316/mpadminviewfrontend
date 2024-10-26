import { useList, useNavigation } from "@refinedev/core";

import { GoogleMap, MapMarker } from "../../../components";
import type { IShipment } from "../../../interfaces";

export const DeliveryMap: React.FC = () => {
    const { data: orderData } = useList<IShipment>({
        resource: "shipments",
        config: {
            filters: [
                {
                    field: "status.text",
                    operator: "eq",
                    value: "On The Way",
                },
            ],
            pagination: {
                pageSize: 1000,
            },
        },
    });

    const defaultProps = {
        center: {
            lat: 40.73061,
            lng: -73.935242,
        },
        zoom: 13,
    };

    const { show } = useNavigation();

    return (
        <GoogleMap mapProps={{ ...defaultProps }}>
            {orderData?.data.map((order) => {
                return (
                    <MapMarker
                        key={order.shipment_id}
                        onClick={() => show("orders", order.shipment_id)}
                        icon={{
                            url: "/images/marker-courier.svg",
                        }}
                        position={{
                            // lat: Number(order.shipfrom.coordinate[0]),
                            // lng: Number(order.shipfrom.coordinate[1]),
                            lat: 80,
                            lng: 80,
                        }}
                    />
                );
            })}
            {orderData?.data.map((order) => {
                return (
                    <MapMarker
                        key={order.shipment_id}
                        onClick={() => show("orders", order.shipment_id)}
                        icon={{
                            url: "/images/marker-location.svg",
                        }}
                        position={{
                            // lat: Number(order.shipto.coordinate[0]),
                            // lng: Number(order.shipto.coordinate[1]),
                            lat: 160,
                            lng: 160,
                        }}
                    />
                );
            })}
        </GoogleMap>
    );
};
