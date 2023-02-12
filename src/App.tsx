import React from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldPathValue,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const SelectValue = [
  { value: "10", label: "The entire place" },
  { value: "20", label: "A private room" },
  { value: "30", label: "A shared room" },
] as const;

const SelectValueWrong = [
  { value: "101", label: "The entire place" },
  { value: "20", label: "A private room" },
  { value: "30", label: "A shared room" },
] as const;

type Property = typeof SelectValue[number]["value"];
const VALUES: [Property, ...Property[]] = [
  SelectValue[0].value,
  ...SelectValue.slice(1).map((p) => p.value),
];

const PropertySchema = z.enum(VALUES);

const formSchema = z
  .object({
    example: PropertySchema,
    exampleRequired: z.string(),
    example3: PropertySchema,
  })
  .required({
    exampleRequired: true,
  });

type Inputs = z.infer<typeof formSchema>;

const initValues: Inputs = {
  example: "10",
  exampleRequired: "exampleRequired",
  example3: "20",
};

function App() {
  const methods = useForm<Inputs>({
    defaultValues: initValues,
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data, errors);
  };

  return (
    <div className="App" style={{ margin: "20px" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input1
          name="example"
          setFormValue={setValue}
          control={control}
          data={SelectValue}
        />
        {errors.example && errors.example.message}

        <Input2
          register={register}
          name="exampleRequired"
          setFormValue={setValue}
        />
        {errors.exampleRequired && errors.exampleRequired.message}

        <Input3 control={control} name="example3" data={SelectValueWrong} />
        {errors.example3 && errors.example3.message}

        <input type="submit" />
      </form>
    </div>
  );
}

export default App;

type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  setFormValue: UseFormSetValue<T>;
  data: ReadonlyArray<{
    label: string;
    value: FieldPathValue<T, FieldPath<T>>;
  }>;
};

const Input1 = <T extends FieldValues>({
  name,
  control,
  setFormValue,
  data,
}: Props<T>) => {
  const value = useWatch({ name, control });

  const handleChange = (event: SelectChangeEvent) => {
    setFormValue(
      name,
      (event.target.value + "11") as FieldPathValue<T, FieldPath<T>>
    );
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Age"
        onChange={handleChange}
      >
        {data.map((entry) => {
          return (
            <MenuItem key={entry.value} value={entry.value}>
              {entry.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

type Props2<T extends FieldValues> = {
  name: FieldPath<T>;
  register: UseFormRegister<T>;
  setFormValue: UseFormSetValue<T>;
};

const Input2 = <T extends FieldValues>({
  name,
  register,
  setFormValue,
}: Props2<T>) => {
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setFormValue(
      name,
      (event.currentTarget.value + "11") as FieldPathValue<T, FieldPath<T>>,
      { shouldValidate: true }
    );
  };
  return <input {...register(name)} onChange={handleChange} />;
};

type Props3<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  data: ReadonlyArray<{
    label: string;
    value: FieldPathValue<T, FieldPath<T>>;
  }>;
};

const Input3 = <T extends FieldValues>({ name, control, data }: Props3<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => {
      return (
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            {...field}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
          >
            {data.map((entry) => {
              return (
                <MenuItem key={entry.value} value={entry.value}>
                  {entry.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
    }}
  />
);
