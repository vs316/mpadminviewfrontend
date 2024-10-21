import Rating from "@mui/material/Rating";
import type { ICourier, IReview } from "../../../interfaces";
import { useList } from "@refinedev/core";

type Props = {
    couriers?: ICourier;
};

export const CourierRating = (props: Props) => {
    const { data } = useList<ICourier>({
        resource: "couriers",
        filters: [
            {
                field: "courier_id",
                operator: "eq",
                value: props.couriers?.courier_id,
            },
        ],
        pagination: {
            mode: "off",
        },
        queryOptions: {
            enabled: !!props.couriers?.courier_id,
        },
    });

    const review = data?.data || [];
    const totalStarCount = review?.reduce(
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
