import React from "react";
import {
    useTranslate,
    useApiUrl,
    type HttpError,
    useGetToPath,
    useGo,
} from "@refinedev/core";
import InputMask from "react-input-mask";
import { useSearchParams } from "react-router-dom";
import { useAutocomplete } from "@refinedev/mui";
import {
    type UseStepsFormReturnType,
    useStepsForm,
} from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepButton from "@mui/material/StepButton";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem"; // Added import for MenuItem
import type { TextFieldProps } from "@mui/material/TextField";
import type { ICourier, IFile, IStore, Nullable } from "../../interfaces";
import { useImageUpload } from "../../utils";
import Divider from "@mui/material/Divider";
import { courierService } from "../../services/courierService";

export const CourierCreate = () => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const t = useTranslate();

    const stepsForm = useStepsForm<ICourier, HttpError, Nullable<ICourier>>({
        stepsProps: {
            isBackValidate: false,
        },
    });

    const { stepTitles, stepFormFields } = useStepsFormList({ stepsForm });

    const isLastStep =
        stepsForm.steps.currentStep === stepFormFields.length - 1;

    const isFirstStep = stepsForm.steps.currentStep === 0;

    const onModalClose = () => {
        go({
            to:
                searchParams.get("to") ??
                getToPath({
                    action: "list",
                }) ??
                "",
            query: {
                to: undefined,
            },
            options: {
                keepQuery: true,
            },
            type: "replace",
        });
    };
    const handleSubmit = async (data: ICourier) => {
        try {
            const response = await courierService.createCourier({
                name: data.name,
                vehicle_id: data.vehicle_id,
                phone_number: data.phone_number,
                email: data.email,
                address: data.address,
                status: data.status,
                rating: data.rating,
            });
            console.log("Courier created successfully:", response);
            onModalClose(); // Close the modal after successful creation
        } catch (error) {
            console.error("Error creating courier:", error);
        }
    };
    return (
        <Dialog
            open
            sx={{
                "& .MuiDialog-paper": {
                    maxWidth: "640px",
                    width: "100%",
                },
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                {"Add Courier Details"}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onModalClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <Stepper nonLinear activeStep={stepsForm.steps.currentStep}>
                    {stepTitles.map((label, index) => (
                        <Step
                            key={label}
                            sx={{
                                "& .MuiStepIcon-text": {
                                    fill: (theme) =>
                                        theme.palette.mode === "light"
                                            ? "white"
                                            : "black",
                                },
                            }}
                        >
                            <StepButton
                                onClick={() => stepsForm.steps.gotoStep(index)}
                            >
                                {label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                <Box mt="48px">
                    <form onSubmit={stepsForm.handleSubmit(handleSubmit)}>
                        {stepFormFields[stepsForm.steps.currentStep]}
                    </form>
                </Box>

                <Divider
                    sx={{
                        margin: "24px 0",
                    }}
                />
                <Stack direction="row" justifyContent="space-between">
                    <Button
                        onClick={onModalClose}
                        color="inherit"
                        variant="text"
                    >
                        {t("buttons.cancel")}
                    </Button>
                    <Stack direction="row" spacing="8px">
                        {!isFirstStep && (
                            <Button
                                disabled={isFirstStep}
                                variant="outlined"
                                color="inherit"
                                onClick={() => {
                                    stepsForm.steps.gotoStep(
                                        stepsForm.steps.currentStep - 1
                                    );
                                }}
                            >
                                {t("buttons.previousStep")}
                            </Button>
                        )}
                        {isLastStep ? (
                            <Button
                                type="submit"
                                variant="contained"
                                {...stepsForm.saveButtonProps}
                            >
                                {t("buttons.save")}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    stepsForm.steps.gotoStep(
                                        stepsForm.steps.currentStep + 1
                                    );
                                }}
                            >
                                {t("buttons.nextStep")}
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

type UseStepsFormList = {
    stepsForm: UseStepsFormReturnType<ICourier, HttpError, Nullable<ICourier>>;
};

const useStepsFormList = ({ stepsForm }: UseStepsFormList) => {
    const t = useTranslate();
    const apiUrl = useApiUrl();

    const {
        watch,
        control,
        setValue,
        formState: { errors },
        refineCore: { formLoading },
    } = stepsForm;
    //const avatarInput: IFile[] | null = watch("avatar");

    const { autocompleteProps: storesAutoCompleteProps } =
        useAutocomplete<IStore>({
            resource: "stores",
        });

    const { autocompleteProps: vehiclesAutoCompleteProps } = useAutocomplete({
        resource: "vehicles",
    });

    const imageUploadOnChangeHandler = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const target = event.target;
        const file: File = (target.files as FileList)[0];

        const image = await useImageUpload({
            apiUrl,
            file,
        });

        // setValue("avatar", image, { shouldValidate: true });
    };

    const stepPersonal = (
        <Stack gap="24px" key="step-personal">
            {/* <Controller
        control={control}
       // name="avatar"
        defaultValue={null}
        rules={{
          required: t("errors.required.field", {
            field: "avatar",
          }),
        }}
        render={({ field }) => {
          return (
            <CourierImageUpload
              {...field}
              previewURL={avatarInput?.[0]?.url}
              showOverlay={false}
              inputProps={{
                id: "avatar",
                onChange: imageUploadOnChangeHandler,
              }}
              sx={{
                margin: "auto",
              }}
            />
          );
        }}
      />
      {errors.avatar && (
        <FormHelperText error>{errors.avatar.message}</FormHelperText>
      )} */}
            <FormControl fullWidth>
                <Controller
                    control={control}
                    name="name"
                    defaultValue=""
                    rules={{
                        required: t("errors.required.field", {
                            field: "name",
                        }),
                    }}
                    render={({ field }) => {
                        return (
                            <TextField
                                {...field}
                                variant="outlined"
                                type="name"
                                id="name"
                                required
                                sx={{
                                    "& .MuiInputBase-input": {
                                        backgroundColor: ({ palette }) =>
                                            palette.mode === "dark"
                                                ? "#1E1E1E"
                                                : palette.background.paper,
                                    },
                                }}
                                label={"Name"}
                                placeholder={"Enter Full Name"}
                            />
                        );
                    }}
                />
                {errors.name && (
                    <FormHelperText error>{errors.name.message}</FormHelperText>
                )}
            </FormControl>{" "}
            <FormControl fullWidth>
                <Controller
                    control={control}
                    name="email"
                    defaultValue=""
                    rules={{
                        required: t("errors.required.field", {
                            field: "email",
                        }),
                    }}
                    render={({ field }) => {
                        return (
                            <TextField
                                {...field}
                                variant="outlined"
                                type="email"
                                id="email"
                                required
                                label={"Email"}
                                placeholder={"Enter Email"}
                            />
                        );
                    }}
                />
                {errors.email && (
                    <FormHelperText error>
                        {errors.email.message}
                    </FormHelperText>
                )}
            </FormControl>
            <FormControl fullWidth>
                <Controller
                    control={control}
                    name="phone_number"
                    defaultValue=""
                    rules={{
                        required: t("errors.required.field", {
                            field: "phone_number",
                        }),
                    }}
                    render={({ field }) => {
                        return (
                            <InputMask
                                {...field}
                                mask="(99) 9999 9999"
                                disabled={formLoading}
                            >
                                {/* @ts-expect-error False alarm */}
                                {(props: TextFieldProps) => (
                                    <TextField
                                        {...props}
                                        required
                                        variant="outlined"
                                        id="phoneNumber"
                                        label={"Phone number"}
                                        placeholder={"Enter Phone number"}
                                    />
                                )}
                            </InputMask>
                        );
                    }}
                />
                {errors.phone_number && (
                    <FormHelperText error>
                        {errors.phone_number.message}
                    </FormHelperText>
                )}
            </FormControl>
            {/* New Field for Vehicle ID (License Plate) */}
            <FormControl fullWidth>
                <Controller
                    control={control}
                    name="vehicle_id"
                    defaultValue=""
                    rules={{
                        required: t("errors.required.field", {
                            field: "vehicle_id",
                        }),
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            id="vehicle_id"
                            required
                            label={"License Plate"}
                            placeholder={"Enter Vehicle License Plate"}
                        />
                    )}
                />
                {errors.vehicle_id && (
                    <FormHelperText error>
                        {errors.vehicle_id.message}
                    </FormHelperText>
                )}
            </FormControl>
            {/* New Field for Gender
            <FormControl fullWidth>
                <Controller
                    control={control}
                    name="gender"
                    defaultValue="Male"
                    rules={{
                        required: t("errors.required.field", {
                            field: "gender",
                        }),
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            variant="outlined"
                            id="gender"
                            required
                            label={"Gender"}
                            placeholder={"Select Gender"}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </TextField>
                    )}
                />
                {errors.gender && (
                    <FormHelperText error>
                        {errors.gender.message}
                    </FormHelperText>
                )}
            </FormControl> */}
            {/* <FormControl fullWidth>
                <Controller
                    control={control}
                    name="address"
                    defaultValue=""
                    rules={{
                        required: t("errors.required.field", {
                            field: "address",
                        }),
                    }}
                    render={({ field }) => {
                        return (
                            <TextField
                                {...field}
                                required
                                variant="outlined"
                                id="address"
                                label={"Address"}
                                placeholder={"Address"}
                            />
                        );
                    }}
                />
                {errors.address && (
                    <FormHelperText error>
                        {errors.address.message}
                    </FormHelperText>
                )}
            </FormControl> */}
        </Stack>
    );

    // const stepCompany = (
    // <Stack gap="24px" key="step-company">
    /* <FormControl fullWidth size="small">
        <Controller
          control={control}
          name="store"
          rules={{
            required: "Store required",
          }}
          defaultValue={null}
          render={({ field }) => (
            <Autocomplete
              {...storesAutoCompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value);
              }}
              getOptionLabel={(item) => {
                return item.title ? item.title : "";
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined ||
                option?.id?.toString() === (value?.id ?? value)?.toString()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("courier.fields.store.label")}
                  variant="outlined"
                  error={!!errors.store}
                  required
                />
              )}
            />
          )}
        />
        {errors.store && (
          <FormHelperText error>{errors.store.message}</FormHelperText>
        )}
      </FormControl>
         <FormControl fullWidth>
                <Controller
                    control={control}
                    name="accountNumber"
                    defaultValue=""
                    rules={{
                        min: 10,
                        required: t("errors.required.field", {
                            field: "accountNumber",
                        }),
                    }}
                    render={({ field }) => {
                        return (
                            <TextField
                                {...field}
                                name="accountNumber"
                                required
                                variant="outlined"
                                label={t("courier.fields.accountNumber.label")}
                                placeholder={t(
                                    "courier.fields.accountNumber.label"
                                )}
                            />
                        );
                    }}
                />
                {errors.accountNumber && (
                    <FormHelperText error>
                        {errors.accountNumber.message}
                    </FormHelperText>
                )}
            </FormControl>
            */
    //     </Stack>
    // );
    // const stepVehicle = (
    //     <Stack gap="24px" key="step-vehicle">
    //         <FormControl fullWidth>
    //             <Controller
    //                 control={control}
    //                 name="vehicle"
    //                 rules={{
    //                     required: "vehicle required",
    //                 }}
    //                 defaultValue={null}
    //                 render={({ field }) => (
    //                     <Autocomplete
    //                         {...vehiclesAutoCompleteProps}
    //                         {...field}
    //                         onChange={(_, value) => {
    //                             field.onChange(value);
    //                         }}
    //                         getOptionLabel={(item) => {
    //                             return item.model ? item.model : "";
    //                         }}
    //                         isOptionEqualToValue={(option, value) =>
    //                             value === undefined ||
    //                             option?.id?.toString() ===
    //                                 (value?.id ?? value)?.toString()
    //                         }
    //                         renderInput={(params) => (
    //                             <TextField
    //                                 {...params}
    //                                 label={t("courier.fields.vehicle.label")}
    //                                 variant="outlined"
    //                                 error={!!errors.vehicle}
    //                                 required
    //                             />
    //                         )}
    //                     />
    //                 )}
    //             />
    //             {errors.vehicle && (
    //                 <FormHelperText error>
    //                     {errors.vehicle.message}
    //                 </FormHelperText>
    //             )}
    //         </FormControl>
    //         <FormControl fullWidth>
    //             <Controller
    //                 control={control}
    //                 name="vehicle_id"
    //                 defaultValue=""
    //                 rules={{
    //                     required: t("errors.required.field", {
    //                         field: "vehicle_id",
    //                     }),
    //                 }}
    //                 render={({ field }) => {
    //                     return (
    //                         <TextField
    //                             {...field}
    //                             name="vehicle_id"
    //                             required
    //                             variant="outlined"
    //                             label={t("courier.fields.vehicle_id.label")}
    //                             placeholder={t(
    //                                 "courier.fields.vehicle_id.label"
    //                             )}
    //                         />
    //                     );
    //                 }}
    //             />
    //             {errors.vehicle_id && (
    //                 <FormHelperText error>
    //                     {errors.vehicle_id.message}
    //                 </FormHelperText>
    //             )}
    //         </FormControl>
    //     </Stack>
    // );

    const stepTitles = [
        "Personal Details",
        //t("courier.steps.company"),
        //"Vehicle Details",
    ];

    return {
        stepTitles,
        stepFormFields: [
            stepPersonal,
            // stepCompany,
            //stepVehicle,
        ],
    };
};
