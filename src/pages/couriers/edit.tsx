import React from "react";
import InputMask from "react-input-mask";
import { useTranslate, type HttpError, useNavigation } from "@refinedev/core";
import { DeleteButton, ListButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import type { TextFieldProps } from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import type { ICourier, Nullable } from "../../interfaces";
import { CourierTableReviews } from "../../components";
import { courierService } from "../../services/courierService";

export const CourierEdit = () => {
    const { list } = useNavigation();
    const t = useTranslate();
    const { palette } = useTheme();

    const {
        control,
        handleSubmit,
        formState: { errors },
        refineCore: { queryResult },
    } = useForm<ICourier, HttpError, Nullable<ICourier>>({
        refineCoreProps: {
            redirect: false,
            action: "edit",
        },
    });

    const courier = queryResult?.data?.data;

    const onSubmit = async (data: Nullable<ICourier>) => {
        try {
            if (courier?.courier_id) {
                await courierService.updateCourier(courier.courier_id, {
                    name: data.name,
                    email: data.email,
                    phone_number: data.phone_number,
                    vehicle_id: data.vehicle_id,
                    status: courier.status,
                    rating: courier.rating,
                    address: courier.address,
                });
                list("couriers");
            }
        } catch (error) {
            console.error("Error updating courier:", error);
        }
    };

    const handleDelete = async () => {
        if (courier?.courier_id) {
            try {
                await courierService.deleteCourier(courier.courier_id);
                list("couriers");
            } catch (error) {
                console.error("Error deleting courier:", error);
            }
        }
    };

    return (
        <>
            <ListButton
                variant="outlined"
                sx={{
                    borderColor: "GrayText",
                    color: "GrayText",
                    backgroundColor: "transparent",
                }}
                startIcon={<ArrowBack />}
            />
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
                <Grid xs={12} md={12} lg={5}>
                    <form
                        onSubmit={handleSubmit((data) =>
                            onSubmit(data as ICourier)
                        )}
                    >
                        <Box mb={3}>
                            <FormControl fullWidth>
                                <Controller
                                    control={control}
                                    name="name"
                                    defaultValue={courier?.name || ""}
                                    rules={{
                                        required: "Name is required",
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Name"
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                            </FormControl>
                        </Box>

                        <Paper>
                            <Stack p={3} spacing={3}>
                                {/* <FormControl fullWidth>
                                    <Controller
                                        control={control}
                                        name="phone_number"
                                        defaultValue={
                                            courier?.phone_number || ""
                                        }
                                        rules={{
                                            required:
                                                "Phone number is required",
                                        }}
                                        render={({
                                            field: { ref, ...field },
                                        }) => (
                                            <InputMask
                                                {...field}
                                                mask="(99) 9999 9999"
                                                maskChar="_"
                                            >
                                                {(inputProps: {
                                                    onChange: React.ChangeEventHandler<HTMLInputElement>;
                                                    value: string;
                                                }) => (
                                                    <TextField
                                                        {...inputProps}
                                                        inputRef={ref}
                                                        label="Phone Number"
                                                        error={
                                                            !!errors.phone_number
                                                        }
                                                        helperText={
                                                            errors.phone_number
                                                                ?.message
                                                        }
                                                        fullWidth
                                                    />
                                                )}
                                            </InputMask>
                                        )}
                                    />
                                </FormControl> */}

                                <FormControl fullWidth>
                                    <Controller
                                        control={control}
                                        name="email"
                                        defaultValue={courier?.email || ""}
                                        rules={{
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message:
                                                    "Invalid email address",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Email"
                                                error={!!errors.email}
                                                helperText={
                                                    errors.email?.message
                                                }
                                                fullWidth
                                            />
                                        )}
                                    />
                                </FormControl>

                                <FormControl fullWidth>
                                    <Controller
                                        control={control}
                                        name="vehicle_id"
                                        defaultValue={courier?.vehicle_id || ""}
                                        rules={{
                                            required:
                                                "License plate is required",
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="License Plate"
                                                error={!!errors.vehicle_id}
                                                helperText={
                                                    errors.vehicle_id?.message
                                                }
                                                fullWidth
                                            />
                                        )}
                                    />
                                </FormControl>

                                <Divider />

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >
                                    <DeleteButton
                                        recordItemId={courier?.courier_id}
                                        onClick={handleDelete}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Save
                                    </Button>
                                </Stack>
                            </Stack>
                        </Paper>
                    </form>
                </Grid>
                <Grid xs={12} md={12} lg={7}>
                    <CourierTableReviews courier={courier} />
                </Grid>
            </Grid>
        </>
    );
};
