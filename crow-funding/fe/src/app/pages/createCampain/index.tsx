import { ChangeEvent, SyntheticEvent, FC, ReactElement, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { names, T_InforCampaiin } from './consts';
import { CampainSchema } from './validate';

const CreateCampain = (): ReactElement => {
    const [inforCampain, setInforCampain] = useState<T_InforCampaiin>();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_InforCampaiin>({
        mode: 'onBlur',
        resolver: yupResolver(CampainSchema),
    });

    const hanldeInforCampain = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInforCampain({
            ...inforCampain,
            [name]: value,
        });
    };

    const onSubmitForm = () => {
        console.log('handleSubmit');
    };

    const disabledBtn = !!(
        errors[names.title] ||
        errors[names.des] ||
        errors[names.imgLink] ||
        !watch()[names.title] ||
        !watch()[names.des] ||
        !watch()[names.imgLink]
    );

    return (
        <section>
            <form>
                <TextField
                    required
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    id="title"
                    type="text"
                    label="Title"
                    {...register(names.title)}
                    error={!!errors[names.title]}
                    helperText={errors[names.title]?.message}
                />
                <TextField
                    required
                    fullWidth
                    variant="outlined"
                    type="text"
                    margin="normal"
                    id="description"
                    label="Description"
                    {...register(names.des)}
                    error={!!errors[names.des]}
                    helperText={errors[names.des]?.message}
                />
                <TextField
                    required
                    fullWidth
                    variant="outlined"
                    type="text"
                    margin="normal"
                    label="Image Link"
                    {...register(names.imgLink)}
                    error={!!errors[names.imgLink]}
                    helperText={errors[names.imgLink]?.message}
                />
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    disabled={disabledBtn}
                    onClick={handleSubmit(onSubmitForm)}
                >
                    Primary
                </Button>
            </form>
        </section>
    );
};

export default CreateCampain;
