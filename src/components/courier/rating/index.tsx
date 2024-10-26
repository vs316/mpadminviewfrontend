import Rating from "@mui/material/Rating";
import type { ICourier } from "../../../interfaces";
import { useList } from "@refinedev/core";

type Props = {
    couriers?: ICourier;
};

export const CourierRating = ({ couriers }: Props) => {
    if (!couriers?.courier_id) {
        return null; // Early return to avoid unnecessary rendering
    }

    const { data } = useList<ICourier>({
        resource: "couriers",
        filters: [
            {
                field: "courier_id",
                operator: "eq",
                value: couriers.courier_id,
            },
        ],
        pagination: { mode: "off" },
        queryOptions: { enabled: !!couriers?.courier_id },
    });

    const review = data?.data || [];
    const totalStarCount = review.reduce(
        (acc, curr) => acc + (curr?.rating || 0),
        0
    );
    const avgStar = totalStarCount / (review?.length || 1);

    return (
        <Rating
            name="courier-rating"
            value={avgStar}
            precision={0.5}
            readOnly
        />
    );
};
