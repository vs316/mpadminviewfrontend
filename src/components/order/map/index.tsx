import { GoogleMap, MapMarker } from "../../map";
import type { IOrder } from "../../../interfaces";

type Props = {
    order?: IOrder;
};

export const OrderDeliveryMap = ({ order }: Props) => {
    return (
        <GoogleMap
            mapProps={{
                center: {
                    lat: 40.73061,
                    lng: -73.935242,
                },
                zoom: 9,
            }}
        >
            <MapMarker
                key={`user-marker-${order?.user.user_id}`}
                icon={{
                    url: "/images/marker-customer.svg",
                }}
                position={{
                    lat: Number(order?.address.coordinate[0]),
                    lng: Number(order?.address.coordinate[1]),
                }}
            />
            <MapMarker
                key={`user-marker-${order?.user.user_id}`}
                icon={{
                    url: "/images/marker-courier.svg",
                }}
                position={{
                    lat: 80,
                    lng: 80,
                }}
            />
        </GoogleMap>
    );
};
